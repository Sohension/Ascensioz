import AfterAuthnav from "@/app/AfterAuthnav"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AfterAuthnav />
      <main>{children}</main>
    </>
  );
}