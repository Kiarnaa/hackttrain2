import { motion } from "framer-motion";
import LandingHeader from "../components/LandingHeader";

const About = () => {
  return (
    <div style={styles.page}>
      <LandingHeader />
      <div style={styles.bodyWrapper}>
        <motion.div
          style={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Notre Histoire : L'Essence de ETHKL
          </motion.h1>
          <motion.p
            style={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            L'Art de se vêtir, l'Audace de l'Élégance.
          </motion.p>
          <motion.div
            style={styles.content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p>
              Fondée sur la conviction que la mode est le miroir de l'âme, ETHKL est née d'un désir simple : fusionner le confort intemporel et l'esthétique contemporaine. Ce qui n'était au départ qu'une passion pour les matières nobles et les coupes impeccables est devenu aujourd'hui une destination incontournable pour les amoureux du prêt-à-porter masculin et féminin.
            </p>
            <h2 style={styles.heading}>Notre Philosophie</h2>
            <p>
              Chez ETHKL, nous ne créons pas seulement des collections ; nous sélectionnons des pièces qui racontent une histoire. Des chaussures aux finitions artisanales jusqu'aux vêtements aux lignes épurées, chaque article est choisi pour sa durabilité et son style sans effort.
            </p>
            <h2 style={styles.heading}>Plus qu'une boutique, un héritage</h2>
            <p>
              Le nom ETHKL incarne notre engagement envers la qualité. Pour l'homme moderne en quête de structure et la femme audacieuse cherchant la fluidité, nous avons bâti un univers où le beige sable rencontre le marron terreux, évoquant une élégance naturelle et organique.
            </p>
            <p>
              Depuis nos débuts, notre mission reste la même : vous offrir le luxe de la confiance en soi, une pièce à la fois.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const palette = {
  white: "#FAFAF8",
  beige: "#E8E0D0",
  beigeLight: "#F2EDE4",
  beigeDark: "#D4C8B4",
  maroon: "#6B1E2A",
  text: "#1A1410",
  textMuted: "#7A6E64",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: palette.white,
    fontFamily: "'DM Sans', sans-serif",
    color: palette.text,
  },
  bodyWrapper: {
    padding: "64px 20px 80px",
  },
  container: {
    maxWidth: 800,
    margin: "0 auto",
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 36,
    fontWeight: 600,
    color: palette.maroon,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontStyle: "italic",
    color: palette.textMuted,
    textAlign: "center",
    marginBottom: 40,
  },
  content: {
    lineHeight: 1.7,
    fontSize: 16,
  },
  heading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 24,
    fontWeight: 600,
    color: palette.maroon,
    marginTop: 32,
    marginBottom: 16,
  },
};

export default About;