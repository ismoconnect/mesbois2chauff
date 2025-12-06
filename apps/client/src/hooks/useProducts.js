import { useState, useEffect } from 'react';
import { getProducts, searchProducts } from '../firebase/products';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getProducts(filters);
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
};

export const useProductSearch = (searchTerm, filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setProducts([]);
      return;
    }

    const searchProductsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await searchProducts(searchTerm, filters);
        
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors de la recherche');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProductsData, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  return { products, loading, error };
};

