const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const DELIVERY_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL || '';
const API_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`;

export function buildImageUrl(imageId: string, variant = 'public'): string {
    const base = DELIVERY_URL.replace(/\/+$/, '');   // strip ALL trailing slashes
    const id = imageId.replace(/^\/+/, '');        // strip ALL leading slashes
    return `${base}/${id}/${variant}`;
}

export async function uploadToCloudflare(
    file: File,
    metadata?: Record<string, string>
): Promise<{ imageId: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    // Optional: tag the image with metadata (folder simulation)
    if (metadata) {
        formData.append('metadata', JSON.stringify(metadata));
    }

    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
        },
        body: formData,
    });

    const data = await res.json();

    if (!data.success) {
        const msg = data.errors?.[0]?.message || 'Upload failed';
        throw new Error(msg);
    }

    const imageId = data.result.id as string;
    return {
        imageId,
        url: buildImageUrl(imageId, 'public'),
    };
}

export async function deleteFromCloudflare(imageId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error('Delete failed');
}
