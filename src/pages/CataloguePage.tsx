import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";
import { ModelArticle } from "../components/ModelArticle";

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("date_desc");

  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery<Article[]>({
    queryKey: [
      "articles-list",
      search,
      category,
      condition,
      priceMin,
      priceMax,
      sort,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (condition) params.append("condition", condition);
      if (priceMin) params.append("priceMin", priceMin);
      if (priceMax) params.append("priceMax", priceMax);
      if (sort) params.append("sort", sort);

      const queryString = params.toString();
      const endpoint = queryString
        ? `/api/articles?${queryString}`
        : "/api/articles";

      return await api.get<Article[]>(endpoint);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catalogue</h1>

      <div className="flex flex-col gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Rechercher des articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Tous les états</option>
            {CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2 items-center flex-1">
            <input
              type="number"
              placeholder="Prix min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              min="0"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Prix max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              min="0"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded md:w-auto w-full"
          >
            <option value="date_desc">Plus récent</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinted-teal"></div>
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-200">
          Erreur lors de la récupération des articles. L'API ne répond pas.
        </div>
      )}

      {!isLoading && !isError && articles && (
        <>
          {articles.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border">
              Aucun article ne correspond à vos filtres.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {articles.map((article) => (
                <ModelArticle key={article.id} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
