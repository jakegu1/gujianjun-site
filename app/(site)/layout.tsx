import Nav from '@/components/Nav'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Nav />
      <div className="pt-14">{children}</div>
    </>
  )
}
