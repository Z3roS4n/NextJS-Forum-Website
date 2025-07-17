import { Author_Subscription } from "@/types/components";

export default async function ProfilesPage({ params }: { params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

    // Qui potresti fare fetch di dati legati a `profile`
    // const data = await fetchProfileData(profile);

    const res = await fetch(`${process.env.LOCAL_URL}/api/user`, { 
        method: 'POST', 
        next: { revalidate: 10 }, 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: slug,
        })
    });
    const userInfo: Author_Subscription = await res.json();

    return (
        <>
            <h1>Profilo: {userInfo.username}</h1>
        </>
    );
}