import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      Click <Link href="/documents/123">&nbsp; here &nbsp;</Link> to go to the documents page.
    </div>
  );
}
