import { useNavigate } from "react-router-dom";
import type { Article } from "../types/article";

type ModelArticleProps = {
  article: Article;
};

export const ModelArticle = ({ article }: ModelArticleProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/articles/${article.id}`)}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white block cursor-pointer"
    >
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg truncate">{article.title}</h3>
        <p className="text-xl text-vinted-teal font-semibold mt-1">
          {article.price.toFixed(2)} €
        </p>
        <div className="text-sm text-gray-500 mt-2 space-y-1">
          <p>Taille : {article.size}</p>
          <p>État : {article.condition}</p>
          <p>Vendeur : {article.userName}</p>
        </div>
      </div>
    </div>
  );
};
