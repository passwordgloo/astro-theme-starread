import type { APIRoute } from 'astro';
import { writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

export const prerender = false;

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/ico'];
const DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed', 'text/plain', 'text/csv'];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 20 * 1024 * 1024;

function getUploadDir(type: string): string {
  if (IMAGE_TYPES.includes(type)) {
    return 'public/cover';
  }
  return 'public/attachments';
}

function sanitizeFileName(name: string): string {
  return name.replace(/\/+/g, '_').replace(/\\/g, '_').replace(/\.\.+/g, '.').replace(/^\.+/, '');
}

function getFileExtension(url: string): string {
  const pathname = url.split('?')[0].split('#')[0];
  const ext = extname(pathname);
  return ext || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetPath = formData.get('targetPath') as string | null;
    const remoteUrl = formData.get('url') as string | null;

    if (remoteUrl) {
      return await handleRemoteUpload(remoteUrl, targetPath);
    }

    if (!file) {
      return new Response(JSON.stringify({ success: false, error: '未提供文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return await handleFileUpload(file, targetPath);
  } catch (error) {
    console.error('资源上传失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '资源上传失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

async function handleFileUpload(file: File, targetPath: string | null): Promise<Response> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ success: false, error: '不支持的文件类型' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const maxSize = IMAGE_TYPES.includes(file.type) ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
  if (file.size > maxSize) {
    const limit = IMAGE_TYPES.includes(file.type) ? '5MB' : '20MB';
    return new Response(JSON.stringify({ success: false, error: `文件大小超过限制（最大${limit}）` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const uploadDir = getUploadDir(file.type);
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const uploadedExt = extname(file.name) || getFileExtensionFromMime(file.type);
  const originalName = sanitizeFileName(basename(file.name, uploadedExt));
  let fileName: string;
  let deleteOldFile = null;
  const isImage = IMAGE_TYPES.includes(file.type);
  const basePath = isImage ? '/cover/' : '/attachments/';

  if (targetPath && targetPath.startsWith(basePath)) {
    const targetBaseName = sanitizeFileName(basename(targetPath, extname(targetPath)));
    fileName = `${targetBaseName}${uploadedExt}`;
    deleteOldFile = targetPath.replace(/^\/+/, '');
  } else {
    fileName = `${originalName}${uploadedExt}`;
  }

  const filePath = join(uploadDir, fileName);

  if (deleteOldFile && existsSync(join('public', deleteOldFile))) {
    unlinkSync(join('public', deleteOldFile));
  } else if (existsSync(filePath)) {
    unlinkSync(filePath);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  writeFileSync(filePath, buffer);

  const relativePath = `${basePath}${fileName}`;

  return new Response(JSON.stringify({
    success: true,
    path: relativePath,
    fileName: fileName,
    type: isImage ? 'image' : 'document'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleRemoteUpload(url: string, targetPath: string | null): Promise<Response> {
  try {
    new URL(url);
  } catch {
    return new Response(JSON.stringify({ success: false, error: '无效的URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return new Response(JSON.stringify({ success: false, error: '无法获取远程文件' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const isImage = IMAGE_TYPES.some(t => contentType.includes(t.split('/')[1]));

  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
  const contentLength = parseInt(response.headers.get('content-length') || '0');
  if (contentLength > maxSize) {
    const limit = isImage ? '5MB' : '20MB';
    return new Response(JSON.stringify({ success: false, error: `文件大小超过限制（最大${limit}）` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const uploadDir = isImage ? 'public/cover' : 'public/attachments';
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const uploadedExt = getFileExtension(url) || getFileExtensionFromMime(contentType);
  const basePath = isImage ? '/cover/' : '/attachments/';

  let fileName: string;
  let deleteOldFile = null;
  if (targetPath && targetPath.startsWith(basePath)) {
    const targetBaseName = sanitizeFileName(basename(targetPath, extname(targetPath)));
    fileName = `${targetBaseName}${uploadedExt}`;
    deleteOldFile = targetPath.replace(/^\/+/, '');
  } else {
    const urlFileName = sanitizeFileName(basename(url, uploadedExt));
    fileName = `${urlFileName}${uploadedExt}`;
  }

  const filePath = join(uploadDir, fileName);

  if (deleteOldFile && existsSync(join('public', deleteOldFile))) {
    unlinkSync(join('public', deleteOldFile));
  } else if (existsSync(filePath)) {
    unlinkSync(filePath);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  writeFileSync(filePath, buffer);

  const relativePath = `${basePath}${fileName}`;

  return new Response(JSON.stringify({
    success: true,
    path: relativePath,
    fileName: fileName,
    type: isImage ? 'image' : 'document'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function getFileExtensionFromMime(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp',
    'image/x-icon': '.ico',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/vnd.ms-excel': '.xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/vnd.ms-powerpoint': '.ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
    'application/zip': '.zip',
    'application/x-rar-compressed': '.rar',
    'application/x-7z-compressed': '.7z',
    'text/plain': '.txt',
    'text/csv': '.csv'
  };
  return mimeMap[mimeType] || '';
}

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return new Response(JSON.stringify({ success: false, error: '未提供文件路径' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedPath = filePath.replace(/^\/+/, '').replace(/\/+/g, '/');
    const fullPath = join('public', normalizedPath);

    if (!existsSync(fullPath)) {
      return new Response(JSON.stringify({ success: false, error: '文件不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!normalizedPath.startsWith('cover/') && !normalizedPath.startsWith('attachments/')) {
      return new Response(JSON.stringify({ success: false, error: '只能删除 cover 或 attachments 目录下的文件' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    unlinkSync(fullPath);

    return new Response(JSON.stringify({
      success: true,
      message: '文件删除成功'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('文件删除失败:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : '文件删除失败'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
