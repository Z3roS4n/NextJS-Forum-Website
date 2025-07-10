import Link from "next/link";

const Footer = () => {
    return (
        <div className="flex justify-center mt-20 mb-10">
            <div className="flex flex-row justify-around items-center w-1/2">
                <div>
                    <h1 className="font-bold text-xl">Links</h1>
                    <div className="flex flex-col">
                        <Link href={"/"}>Privacy Policy</Link>
                        <Link href={"/"}>Cookie Policy</Link>
                    </div>
                </div>
                <div>
                    <h1 className="font-bold text-xl">Pages</h1>
                    <div className="flex flex-col">
                        <Link href={"/articles"}>Articles</Link>
                        <Link href={"/profile"}>Profile</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;