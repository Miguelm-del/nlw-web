interface HomeProps {
	poolsCount: number;
	guessCount: number;
	usersCount: number;
}

import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

export default function Home(props: HomeProps) {
	const [poolTitle, setPoolTitle] = useState("");

	async function createPool(event: FormEvent) {
		event.preventDefault();

		try {
			const response = await api.post("/pools", {
				title: poolTitle,
			});

			const { code } = response.data;

			await navigator.clipboard.writeText(code);

			alert(
				"Bolão criado com sucesso, o código foi copiado para a área de transferência" +
					"\n\nCódigo:" +
					code
			);

			setPoolTitle("");
		} catch (err) {
			console.log(err);
			alert("Falha ao criar o bolão, tente novamente");
		}
	}

	return (
		<div className="max-w-[1124px] mx-auto grid grid-cols-2 items-center h-screen gap-28">
			<main>
				<Image src={logoImg} alt="Logo" />

				<h1 className=" mt-14 text-5xl text-whiteW-500 font-bold leading-tight">
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>

				<div className="mt-10 flex items-center gap-2">
					<Image src={usersAvatarExampleImg} alt="" />
					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{props.usersCount}</span> pessoas
						já estão usando
					</strong>
				</div>

				<form onSubmit={createPool} className="mt-10 flex gap-2">
					<input
						className="text-sm flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100"
						type="text"
						name=""
						id=""
						required
						placeholder="Qual nome do seu bolão"
						onChange={(event) => setPoolTitle(event.target.value)}
						value={poolTitle}
					/>
					<button
						className="px-6 py-4 rounded bg-yellow-500 text-gray-900 font-bold text-small uppercase hover:bg-yellow-700"
						type="submit"
					>
						Criar meu bolão
					</button>
				</form>

				<p className="text-sm mt-4 text-gray-300 leading-relaxed">
					Após criar seu bolão, você receberá um código único que poderá usar
					para convidar outras pessoas 🚀
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
					<div className="flex items-center gap-6">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.poolsCount}</span>
							<span>Bolão Criados</span>
						</div>
					</div>

					<div className="w-px h-14 bg-gray-600" />

					<div className="flex items-center gap-6 ">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.guessCount}</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>

			<Image
				quality={100}
				src={appPreviewImg}
				alt="Dois celulares exibindo uma prévia da aplicação móvel"
			/>
		</div>
	);
}

export async function getStaticProps() {
	const [poolCountResponse, guessCountResponse, usersCountResponse] =
		await Promise.all([
			api.get("pools/count"),
			api.get("guesses/count"),
			api.get("users/count"),
		]);

	return {
		props: {
			poolsCount: poolCountResponse.data.count,
			guessCount: guessCountResponse.data.count,
			usersCount: usersCountResponse.data.count,
		},
		revalidate: 1000
	};
};
