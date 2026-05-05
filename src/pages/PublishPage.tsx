import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { CATEGORIES, CONDITIONS } from "../types/article";

export default function PublishPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [size, setSize] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [apiError, setApiError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const newErrors: Record<string, string> = {};

    if (title.trim().length < 3 || title.trim().length > 100)
      newErrors.title = "le titre doit faire entre 3 et 100 caractères";

    if (description.trim().length < 10 || description.trim().length > 1000)
      newErrors.description = "la description doit faire entre 10 et 1000 caractères";

    if (!price || Number(price) <= 1)
      newErrors.price = "le prix doit être supérieur à 0";

    if (!category)
      newErrors.category = "veuillez choisir une catégorie please";

    if (!condition)
      newErrors.condition = "veuillez choisir un état please";

    if (!size.trim())
      newErrors.size = "La taille est requise";

    if (!imageUrl.trim() || !/^https?:\/\/.{3,}/.test(imageUrl))
      newErrors.imageUrl = "Oups, l'URL de l'image est invalide";

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSubmitting(true);
    try {
      const article = await api.post<Article>("/api/articles", {
        title, description, price: Number(price), category, condition, size, imageUrl,
      }); navigate(`/articles/${article.id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : " une erreur est srvenue ");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6"> Publier une annonce </h1>

      {apiError && <p className="text-red-500 border border-red-200 bg-red-50 p-3 rounded mb-4">{apiError}</p>}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        <div>
          <label className="block font-medium mb-1"> Titre </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2" placeholder="exemple : pull en laine" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> Description </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={4} className="w-full border rounded px-3 py-2" placeholder="donnez une brève description" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> Prix (€) </label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded px-3 py-2" placeholder="exemple : 25" min="0" />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> Catégorie </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value=""> Choisir </option>
            {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> État </label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value=""> Choisir </option>
            {CONDITIONS.map((cond) => <option key={cond.value} value={cond.value}>{cond.label}</option>)}
          </select>
          {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> Taille </label>
          <input type="text" value={size} onChange={(e) => setSize(e.target.value)}
            className="w-full border rounded px-3 py-2" placeholder="exemple : M ou 42" />
          {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1"> URL de l'image </label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded px-3 py-2" placeholder="https://... sur unsplash " />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}
          className="bg-teal-600 text-white font-semibold py-2 rounded hover:bg-teal-700 disabled:opacity-50">
          {isSubmitting ? "attendez un instant please" : "publier"}
        </button>

      </form>
    </div>
  );
}