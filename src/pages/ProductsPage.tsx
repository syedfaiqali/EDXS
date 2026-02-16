import React from 'react';
import { Box } from '@mui/material';
import ProductsSection from '../components/landing/ProductsSection';

const ProductsPage: React.FC = () => {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
            <ProductsSection />
        </Box>
    );
};

export default ProductsPage;
