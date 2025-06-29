import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
    return (
        <nav className="p-6 flex flex-row justify-between">
            <div>
                <Image src={"/next.svg"} alt={"NextLogo"} width={100} height={100}></Image>
            </div>
            <div>
                <Link href='/articles'>Articles</Link>
                <Link href='/profile'>Profile</Link>
            </div>
        </nav>
    );
}

export default NavBar;