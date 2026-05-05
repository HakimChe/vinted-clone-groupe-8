import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { useCurrentUserId } from "../hooks/useCurrentUserId";

export default function MyArticlesPage() {
  
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();
  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["my-articles"],
    queryFn: () => api.get<Article[]>(`/api/users/${userId}/articles`),});

  async function handleDelete(articleId: string) {
    const ok = window.confirm(" voulez-vous vraiment supprimer cette annonce ? ");
    if (!ok) return;
    try {
      await api.delete(`/api/articles/${articleId}`);
      queryClient.invalidateQueries({ queryKey: ["my-articles"] });
    } catch (err) {
      alert((err as Error).message);
    }
  }

  if (isLoading) return <p className="text-center py-10 text-red-500"> Erreur lors du chargement </p>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6"> Mes annonces </h1>
      {articles && articles.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p className="mb-4"> Aucune annonces disponibe pour vous </p>
          <Link to="/publish" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"> Publier une annonce </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {articles?.map((article) => (
          <div key={article.id} className="flex gap-4 border rounded p-4 bg-white">
            <img src={article.imageUrl} alt={article.title} className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{article.title}</h2>
              <p className="text-teal-600 font-semibold">{article.price.toFixed(2)} €</p>
              <p className="text-sm text-gray-500">{article.size} — {article.condition}</p> </div>
            <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700 font-medium self-start"> Supprime moi </button>  </div>  ))}
      </div>
    </div>
 );}