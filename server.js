const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Fixes the connection issue shown in your screenshot
app.use(cors());
app.use(express.json());

// Helper function to easily offset timestamps relative to "now"
const relativeDate = (hoursOffset) => {
    return new Date(Date.now() + hoursOffset * 60 * 60 * 1000).toISOString();
};

// 15 Master Products Matrix
const scheduledProducts = [
    // === ACTIVE SALES (5 Products) ===
    { id: "prod_1", name: "Premium Wireless Headphones", originalPrice: 199.99, discountPercent: 30, startTime: relativeDate(-1), endTime: relativeDate(2), image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_2", name: "4K Ultra-Wide Monitor 34\"", originalPrice: 499.99, discountPercent: 20, startTime: relativeDate(-3), endTime: relativeDate(5), image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_3", name: "Ergonomic Mesh Office Chair", originalPrice: 249.99, discountPercent: 15, startTime: relativeDate(-0.5), endTime: relativeDate(1.5), image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_4", name: "Smart Fitness Watch V2", originalPrice: 179.99, discountPercent: 25, startTime: relativeDate(-2), endTime: relativeDate(4), image: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_5", name: "Professional Vlog Microphone", originalPrice: 89.99, discountPercent: 40, startTime: relativeDate(-4), endTime: relativeDate(1), image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80" },
    
    // === UPCOMING SALES (5 Products) ===
    { id: "prod_6", name: "Minimalist Mechanical Keyboard", originalPrice: 129.99, discountPercent: 15, startTime: relativeDate(3), endTime: relativeDate(8), image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_7", name: "Wireless Multi-Device Mouse", originalPrice: 79.99, discountPercent: 10, startTime: relativeDate(1), endTime: relativeDate(6), image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_8", name: "Premium Leather Backpack", originalPrice: 149.99, discountPercent: 35, startTime: relativeDate(5), endTime: relativeDate(12), image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_9", name: "Portable LED Projector", originalPrice: 349.99, discountPercent: 22, startTime: relativeDate(2.5), endTime: relativeDate(7), image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_10", name: "Stainless Steel Espresso Machine", originalPrice: 599.99, discountPercent: 18, startTime: relativeDate(6), endTime: relativeDate(24), image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80" },
    
    // === EXPIRED SALES (5 Products) ===
    { id: "prod_11", name: "Dual-Device Wireless Charger", originalPrice: 49.99, discountPercent: 50, startTime: relativeDate(-10), endTime: relativeDate(-2), image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_12", name: "HD Wide-Angle Webcam", originalPrice: 69.99, discountPercent: 30, startTime: relativeDate(-6), endTime: relativeDate(-1), image: "https://images.unsplash.com/photo-1603162591621-e0ca1aa4d284?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_13", name: "Noise-Isolating Gaming Headset", originalPrice: 119.99, discountPercent: 20, startTime: relativeDate(-24), endTime: relativeDate(-12), image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_14", name: "Adjustable Desk Dumbbell Set", originalPrice: 299.99, discountPercent: 15, startTime: relativeDate(-48), endTime: relativeDate(-24), image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&w=600&q=80" },
    { id: "prod_15", name: "Smart RGB Floor Lamp", originalPrice: 85.00, discountPercent: 25, startTime: relativeDate(-5), endTime: relativeDate(-0.2), image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80" }
];

app.get('/api/deals', (req, res) => {
    const currentTime = new Date();
    
    const processedDeals = scheduledProducts.map(product => {
        const start = new Date(product.startTime);
        const end = new Date(product.endTime);
        
        let status = 'upcoming';
        let currentPrice = product.originalPrice;
        let timeRemainingMs = 0;

        if (currentTime >= start && currentTime <= end) {
            status = 'active';
            currentPrice = parseFloat((product.originalPrice * (1 - product.discountPercent / 100)).toFixed(2));
            timeRemainingMs = end - currentTime; 
        } else if (currentTime > end) {
            status = 'expired';
            timeRemainingMs = 0;
        } else {
            status = 'upcoming';
            timeRemainingMs = start - currentTime; 
        }

        return {
            id: product.id,
            name: product.name,
            originalPrice: product.originalPrice,
            currentPrice: currentPrice,
            discountPercent: product.discountPercent,
            status: status,
            timeRemainingMs: timeRemainingMs,
            image: product.image
        };
    });
    
    res.json({ deals: processedDeals });
});

app.listen(PORT, () => {
    console.log(`Backend service processing data at http://localhost:${PORT}/api/deals`);
});