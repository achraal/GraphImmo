// // src/components/ProprieteCard.tsx
// import { gql } from "@apollo/client"
// import { useQuery } from "@apollo/client/react"
// import { Link } from "react-router-dom"

// const GET_CARD = gql`
//   query CardPropriete($id: String!) {
//     proprieteDetail(id: $id) {
//       id
//       titre
//       prix
//       adresse
//       surface
//       chambres
//       photos { url angle }
//     }
//   }
// `

// type Photo = { url: string; angle: string }
// type Data = { proprieteDetail: null | { id: string; titre: string; prix: number; adresse: string; surface: number; chambres: number; photos: Photo[] } }
// type Vars = { id: string }

// export default function ProprieteCard({ id }: { id: string }) {
//   const { data, loading } = useQuery<Data, Vars>(GET_CARD, { variables: { id } })

//   if (loading) return <div style={{ border: "1px solid #e5e7eb", padding: 12 }}>Chargement {id}...</div>
//   const p = data?.proprieteDetail
//   if (!p) return null

//   const cover = p.photos?.[0]?.url

//   return (
//     <div style={{ display: "flex", gap: 12, border: "1px solid #e5e7eb", padding: 12, borderRadius: 8 }}>
//       <div style={{ width: 160, height: 110, background: "#f3f4f6", flex: "0 0 auto", overflow: "hidden", borderRadius: 6 }}>
//         {cover ? <img src={cover} alt={p.titre} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
//       </div>

//       <div style={{ flex: 1 }}>
//         <div style={{ fontWeight: 600 }}>{p.titre}</div>
//         <div>{p.prix} MAD</div>
//         <div>{p.surface} m² • {p.chambres} chambres</div>
//         <div style={{ color: "#6b7280" }}>{p.adresse}</div>

//         <Link to={`/propriete/${p.id}`} style={{ display: "inline-block", marginTop: 8 }}>
//           Voir détails
//         </Link>
//       </div>
//     </div>
//   )
// }
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Stack,
  Button,
  Divider
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  SquareFoot as SurfaceIcon,
  Bed as BedIcon,
  ArrowForward as ArrowIcon
} from "@mui/icons-material";

const GET_CARD = gql`
  query CardPropriete($id: String!) {
    proprieteDetail(id: $id) {
      id
      titre
      prix
      adresse
      surface
      chambres
      photos {
        url
        angle
      }
    }
  }
`;

type Photo = { url: string; angle: string };
type Data = {
  proprieteDetail: null | {
    id: string;
    titre: string;
    prix: number;
    adresse: string;
    surface: number;
    chambres: number;
    photos: Photo[];
  };
};
type Vars = { id: string };

export default function ProprieteCard({ id }: { id: string }) {
  const { data, loading } = useQuery<Data, Vars>(GET_CARD, { variables: { id } });

  // État de chargement élégant (Skeleton)
  if (loading) {
    return (
      <Card sx={{ display: "flex", p: 1, borderRadius: 3, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
        <Skeleton variant="rectangular" width={160} height={110} sx={{ borderRadius: 2 }} />
        <Box sx={{ ml: 2, flex: 1 }}>
          <Skeleton width="60%" height={24} />
          <Skeleton width="40%" height={30} sx={{ my: 0.5 }} />
          <Skeleton width="80%" height={20} />
        </Box>
      </Card>
    );
  }

  const p = data?.proprieteDetail;
  if (!p) return null;

  const cover = p.photos?.[0]?.url;

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        p: 1.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        transition: "0.2s",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      {/* Image de couverture */}
      <Box
        sx={{
          width: 160,
          height: 120,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.100",
          flexShrink: 0,
        }}
      >
        {cover ? (
          <img
            src={cover}
            alt={p.titre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
             <Typography variant="caption" color="text.disabled">Pas d'image</Typography>
          </Box>
        )}
      </Box>

      {/* Contenu textuel */}
      <CardContent sx={{ flex: 1, py: 0, px: 2, "&:last-child": { pb: 0 } }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ color: "text.primary", lineHeight: 1.2, mb: 0.5 }}>
          {p.titre}
        </Typography>

        <Typography variant="h6" fontWeight={800} color="primary" sx={{ mb: 1 }}>
          {p.prix.toLocaleString("fr-MA")} <span style={{ fontSize: "0.7em" }}>MAD</span>
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 1, color: "text.secondary" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SurfaceIcon sx={{ fontSize: 16, color: "text.disabled" }} />
            <Typography variant="caption">{p.surface} m²</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
            <Typography variant="caption">{p.chambres} ch.</Typography>
          </Box>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", mb: 1 }}>
          <LocationIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" noWrap>{p.adresse}</Typography>
        </Box>

        <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

        <Button
          component={Link}
          to={`/propriete/${p.id}`}
          size="small"
          endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
          sx={{ 
            p: 0, 
            minWidth: 0, 
            textTransform: "none", 
            fontWeight: 700,
            fontSize: "0.8rem",
            "&:hover": { bgcolor: "transparent", color: "secondary.main" }
          }}
        >
          Voir les détails
        </Button>
      </CardContent>
    </Card>
  );
}