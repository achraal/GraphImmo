// src/utils/formatters.ts
export const formatPrice = (prix: number): string => {
  return new Intl.NumberFormat('fr-MA', { 
    style: 'currency', 
    currency: 'MAD',
    minimumFractionDigits: 0 
  }).format(prix);
};
