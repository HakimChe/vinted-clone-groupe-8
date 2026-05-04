import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery<Article>({
    queryKey: ["article", id],
    queryFn: async () => {
      return await api.get<Article>(`/api/articles/${id}`);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="text-center py-10 text-red-500">
        Erreur : Article introuvable.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="text-blue-500 hover:underline mb-6 text-left"
      >
        &larr; Retour au catalogue
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full md:w-1/2 h-96 object-cover"
        />

        <div className="p-8 md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <p className="text-2xl text-vinted-teal font-semibold mb-6">
            {article.price.toFixed(2)} €
          </p>

          <div className="space-y-4 flex-1">
            <p className="text-gray-700">{article.description}</p>

            <div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
              <p>
                <span className="font-semibold">Catégorie:</span>{" "}
                {article.category}
              </p>
              <p>
                <span className="font-semibold">Taille:</span> {article.size}
              </p>
              <p>
                <span className="font-semibold">État:</span> {article.condition}
              </p>
              <p>
                <span className="font-semibold">Vendeur:</span>{" "}
                {article.userName}
              </p>
              <p>
                <span className="font-semibold">Publié le:</span>{" "}
                {new Date(article.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
