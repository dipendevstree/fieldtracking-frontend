import { useEffect } from "react";

export const useSEO = (title: string) => {

  useEffect(() => {
    const fullTitle = `${title} | FieldTrack360`;
    document.title = fullTitle;
    let metaTitle = document.querySelector<HTMLMetaElement>('meta[name="title"]');
    if (!metaTitle) {
      metaTitle = document.createElement("meta");
      metaTitle.setAttribute("name", "title");
      document.head.appendChild(metaTitle);
    }
    metaTitle.setAttribute("content", fullTitle);
  }, [title]);
  
};
