import QRCodeStyling, { Options, DrawType, TypeNumber, Mode, ErrorCorrectionLevel, DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

/**
 * Retorna as configurações padronizadas do QR Code Konnexy
 */
export const getQRCodeConfig = (url: string, isPro: boolean = false, photoUrl?: string): Options => {
  return {
    width: 1000,
    height: 1000,
    type: "svg" as DrawType,
    data: url,
    image: isPro ? (photoUrl || "/logo-icon.svg") : undefined,
    margin: 20,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: "Byte" as Mode,
      errorCorrectionLevel: "H" as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 10,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: isPro ? "#2563eb" : "#000000",
      type: isPro ? "rounded" as DotType : "square" as DotType,
      gradient: isPro ? {
        type: "linear",
        rotation: 45,
        colorStops: [
          { offset: 0, color: "#2563eb" }, // Azul Konnexy
          { offset: 1, color: "#10b981" }  // Verde Sucesso
        ]
      } : undefined
    },
    backgroundOptions: {
      color: "transparent",
    },
    cornersSquareOptions: {
      color: isPro ? "#2563eb" : "#000000",
      type: isPro ? "extra-rounded" as CornerSquareType : "square" as CornerSquareType,
    },
    cornersDotOptions: {
      color: isPro ? "#10b981" : "#000000",
      type: isPro ? "dot" as CornerDotType : "square" as CornerDotType,
    }
  };
};

/**
 * Função utilitária para geração automática (ex: trigger após criação de conta)
 * Nota: Como o qr-code-styling é uma biblioteca client-side, 
 * esta função deve ser chamada em componentes client ou via useEffect.
 */
export const generateQRCode = async (username: string, isPro: boolean = false) => {
  if (typeof window === 'undefined') return null;
  
  const url = `https://konnexy.com.br/${username}`;
  const options = getQRCodeConfig(url, isPro);
  const qrCode = new QRCodeStyling(options);
  
  console.log(`[Konnexy] QR Code preparado para ${username} (Plano: ${isPro ? 'PRO' : 'FREE'})`);
  
  // Retorna a instância para manipulação (download ou renderização)
  return qrCode;
};
