import RecipeCard from '../components/RecipeCard';

const RECIPES = [
    {
        id: 1,
        name: 'ผัดกะเพราหมูกรอบ (Pad Kra Pao Moo Krob)',
        image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
            { name: 'หมูกรอบ (Crispy Pork)', ratio: '150 g' },
            { name: 'ใบกะเพรา (Holy Basil)', ratio: '20 g' },
            { name: 'พริกแดง (Red Chili)', ratio: '5 g' },
            { name: 'กระเทียม (Garlic)', ratio: '10 g' },
            { name: 'ซอสหอยนางรม (Oyster Sauce)', ratio: '1 tbsp' },
            { name: 'ซีอิ๊วขาว (Soy Sauce)', ratio: '1 tsp' },
            { name: 'น้ำตาลทราย (Sugar)', ratio: '0.5 tsp' },
        ]
    },
    {
        id: 2,
        name: 'ต้มยำกุ้ง (Tom Yum Goong)',
        image: 'https://images.unsplash.com/photo-1548943487-a2e41434ad82?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
            { name: 'กุ้งสด (Fresh Shrimp)', ratio: '200 g' },
            { name: 'ข่า (Galangal)', ratio: '3 slices' },
            { name: 'ตะไคร้ (Lemongrass)', ratio: '1 stalk' },
            { name: 'ใบมะกรูด (Kaffir Lime Leaves)', ratio: '4 leaves' },
            { name: 'น้ำพริกเผา (Chili Paste)', ratio: '2 tbsp' },
            { name: 'น้ำมะนาว (Lime Juice)', ratio: '2 tbsp' },
            { name: 'น้ำปลา (Fish Sauce)', ratio: '1.5 tbsp' },
        ]
    },
    {
        id: 3,
        name: 'ผัดไทยกุ้งสด (Pad Thai Shrimp)',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
            { name: 'เส้นจันท์ (Rice Noodles)', ratio: '150 g' },
            { name: 'กุ้งสด (Fresh Shrimp)', ratio: '100 g' },
            { name: 'เต้าหู้เหลือง (Yellow Tofu)', ratio: '30 g' },
            { name: 'ไข่ไก่ (Egg)', ratio: '1 unit' },
            { name: 'ถั่วงอก (Bean Sprouts)', ratio: '50 g' },
            { name: 'น้ำมะขามเปียก (Tamarind Juice)', ratio: '2 tbsp' },
            { name: 'น้ำตาลปี๊บ (Palm Sugar)', ratio: '1 tbsp' },
        ]
    },
    {
        id: 4,
        name: 'แกงเขียวหวานไก่ (Green Curry Chicken)',
        image: 'https://images.unsplash.com/photo-1606497184201-9cae622b7c69?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
            { name: 'เนื้อไก่ (Chicken Breast)', ratio: '200 g' },
            { name: 'พริกแกงเขียวหวาน (Green Curry Paste)', ratio: '2 tbsp' },
            { name: 'กะทิ (Coconut Milk)', ratio: '250 ml' },
            { name: 'มะเขือเปราะ (Thai Eggplant)', ratio: '80 g' },
            { name: 'ใบโหระพา (Sweet Basil)', ratio: '15 g' },
            { name: 'น้ำปลา (Fish Sauce)', ratio: '1 tbsp' },
            { name: 'น้ำตาลปี๊บ (Palm Sugar)', ratio: '1 tsp' },
        ]
    }
];

export default function RecipePage() {
    return (
        <div className="page-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Recipe Menu</h1>
                    <p className="page-subtitle">Standardized ingredients and ratios for your kitchen</p>
                </div>
            </header>

            <div className="recipe-grid">
                {RECIPES.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}
