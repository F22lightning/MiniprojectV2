import { Info } from 'lucide-react';

export default function RecipeCard({ recipe }) {
    const { name, image, ingredients } = recipe;

    return (
        <div className="recipe-card">
            <div className="recipe-image">
                {image ? (
                    <img src={image} alt={name} />
                ) : (
                    <span>Image Placeholder</span>
                )}
            </div>

            <div className="recipe-content">
                <h3>{name}</h3>
                <p className="text-muted text-sm mb-4 flex items-center gap-1">
                    <Info size={14} /> อัตราส่วนวัตถุดิบ (Ingredients & Ratios)
                </p>

                <ul className="ingredients-list">
                    {ingredients.map((ing, idx) => (
                        <li key={idx}>
                            <span className="ingredient-name">{ing.name}</span>
                            <span className="ingredient-ratio">{ing.ratio}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
