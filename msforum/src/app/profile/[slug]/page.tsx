export default async function ProfilesPage({
  params,
}: {
  params: Promise<{ profile: string }>;
}) {
  const { profile } = await params;

  // Qui potresti fare fetch di dati legati a `profile`
  // const data = await fetchProfileData(profile);

  return (
    <>
      <h1>Profilo: {profile}</h1>
    </>
  );
}