import fs from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export const uploadImageFromBase64 = async (
	imageBase64: string,
): Promise<string | null> => {
	const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

	if (!matches || matches.length !== 3) {
		console.log("Formato de imagem base64 invalido");
		return null;
	}

	const mimeType = matches[1];
	const imageData = matches[2];

	let fileExtension: string;
	switch (mimeType) {
		case "image/jpeg":
			fileExtension = "jpg";
			break;
		case "image/png":
			fileExtension = "png";
			break;
		case "image/gif":
			fileExtension = "gif";
			break;
		case "image/webp": // Adicionando suporte para webp
			fileExtension = "webp";
			break;
		// Adicione outros tipos MIME que você suporta
		default:
			console.error(`Tipo de imagem não suportado: ${mimeType}`);
			return null; // Tipo não suportado
	}

	try {
		const buffer = Buffer.from(imageData, "base64");
		const fileName = `${uuidv4()}.${fileExtension}`;

		const uploadDir = path.join(__dirname, "..", "..", "public", "images");

		await fs.mkdir(uploadDir, { recursive: true });

		const filePath = path.join(uploadDir, fileName);

		console.log(filePath, fileName);
		await fs.writeFile(filePath, buffer);
		return `/static/images/${fileName}`;
	} catch (error) {
		console.error("Erro ao salvar imagem Base64:", error);
		return null;
	}
};

export const deleteImageFromFileSystem = async (imageUrl: string | null | undefined): Promise<void> => {
  if (!imageUrl) return;
  try {
    let fileName: string | null = null;
    if (imageUrl.startsWith('/static/images/')) {
      fileName = imageUrl.replace('/static/images/', '');
    } else if (imageUrl.startsWith('/images/')) {
      // suporte legado
      fileName = imageUrl.replace('/images/', '');
    }
    if (!fileName) return;
    const uploadDir = path.join(__dirname, "..", "..", "public", "images");
    const fullPath = path.join(uploadDir, fileName);
    await fs.unlink(fullPath);
  } catch (error: any) {
    // Se o arquivo não existe (ENOENT), apenas ignora. Outros erros são logados.
    if (error?.code !== 'ENOENT') {
      console.error(`Erro ao deletar imagem '${imageUrl}':`, error);
    }
  }
};
