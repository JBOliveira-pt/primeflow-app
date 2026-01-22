import Image from "next/image";

export default function PrimeflowLogo() {
    return (
        <div className="flex items-center gap-2">
            {/* Logo com suporte a dark/light mode */}
            <Image
                src="/images/primeflow-whiteroundlogo-nobg.png"
                alt="PrimeFlow Logo"
                width={80}
                height={80}
                className="dark:hidden"
            />
            <Image
                src="/images/primeflow-darkroundlogo-nobg.png"
                alt="PrimeFlow Logo"
                width={80}
                height={80}
                className="hidden dark:block"
            />
        </div>
    );
}
