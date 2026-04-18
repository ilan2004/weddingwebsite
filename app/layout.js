import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://eventora.example"),
  title: "Eventora | Kerala Wedding Planning",
  description:
    "Kerala wedding planning studio for Hindu, Christian, and Muslim celebrations. Full planning, partial planning, and wedding-day coordination.",
  keywords: [
    "kerala wedding planner",
    "indian wedding planner kerala",
    "wedding coordination kerala",
    "destination kerala wedding",
    "kochi wedding planner",
  ],
  openGraph: {
    title: "Eventora | Kerala Wedding Planning",
    description:
      "Plan your Kerala wedding with trusted vendors, clear budgets, and seamless wedding-day production.",
    images: ["/hero.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
