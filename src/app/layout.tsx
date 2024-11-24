import "@/styles/globals.css";

import type { Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "MasteryQuest",
	description:
		"Adaptive learning for grades 7-10. Personalized tests that grow with you.",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${inter.variable}`}>
			<body>
				<TRPCReactProvider>
					<ClerkProvider
						dynamic
						appearance={{
							variables: {
								colorPrimary: "#9333ea",
								colorText: "black",
							},
						}}
					>
						{children}
						<Toaster theme="light" richColors />
					</ClerkProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
