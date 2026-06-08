import NextImage, { type ImageProps } from "next/image";

export function CustomImage(props: ImageProps) {
  let { src } = props;
  
  // BasePath set in next.config.ts for GitHub Pages deployment
  const basePath = "/T-Gia-nh";
  
  if (typeof src === "string" && src.startsWith("/") && !src.startsWith(basePath)) {
    src = `${basePath}${src}`;
  }
  
  return <NextImage {...props} src={src} />;
}
