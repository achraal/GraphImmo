import { useQuery } from '@apollo/client/react';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';

const GET_ME = gql`
  query GetMe($token: String!) {
    me(token: $token) {
      role  # "AGENT" ou "ACHETEUR"
    }
  }
`;

export function useUserRole() {
  const token = localStorage.getItem('token');
  const { data, loading, refetch } = useQuery(GET_ME, { 
    variables: { token }, 
    skip: !token,
    fetchPolicy: 'cache-and-network'  // Rafraîchit au focus
  });
  
  const [role, setRole] = useState<string | null>(localStorage.getItem('role') || null);
  
  useEffect(() => {
    if (data?.me?.role) {
      setRole(data.me.role);
      localStorage.setItem('role', data.me.role);
    }
  }, [data]);

  const isAgent = role === 'AGENT';
  const isAcheteur = role === 'ACHETEUR';

  return { role, isAgent, isAcheteur, loading, refetch };
}
