import { createSignal, For, onMount, type Ref, Show } from "solid-js";
import "./App.css";

interface IComment {
	username: string;
	content: string[];
	replies: IComment[];
}

const data: IComment[] = [
	{
		username: "Meowweredoomed",
		content: [
			"Those are all good videos, but in my opinion the best are",
			"Nellis airforce base 1994 (A strong candidate for them being extradimensional)",
			"Turkey 2008",
			"Airport in China 2010",
			"All of which are stunning footage.",
		],
		replies: [
			{
				username: "Iron_Cowboy_",
				content: ["Links if you can please! Would love to see them"],
				replies: [
					{
						username: "Meowweredoomed",
						content: [
							"Nellis 1994",
							"https://youtu.be/KE6MCeEhJUY?si=m6oXCVYZ5S6Z7zrt",
							"Turkey 2008",
							"https://youtube.com/playlist?list=PLLxHwkkcCQiAxs41N15DzcPI46lbJaQZ7&si=KzaIDggaLsmM3OLp",
							"China 2010",
							"https://youtu.be/oucVneQ0_cY?si=BO0VVJcELOIRHsUp",
						],
						replies: [
							{
								username: "AliensKindaLoveMe",
								content: [
									"I forgot about the china one! i'm sad i didnt include it now lol",
								],
								replies: [
									{
										username: "Meowweredoomed",
										content: ["Love the username! 💀"],
										replies: [],
									},
								],
							},
						],
					},
				],
			},
			{
				username: "Meowweredoomed",
				content: ["Love the username! 💀"],
				replies: [],
			},
			{
				username: "Meowweredoomed",
				content: ["Love the username! 💀"],
				replies: [],
			},
		],
	},
	{
		username: "toastedgumball",
		content: ["Because it's fake, it's been debunked"],
		replies: [],
	},
	{
		username: "Iron_Cowboy_",
		content: [
			"Thank you 🙏 that china one is spooky and the turkey one is my all time favorite video!",
		],
		replies: [],
	},
	{
		username: "xOrion12x",
		content: [
			"What is the story behind that nellis video? I have never seen that somehow.",
		],
		replies: [
			{
				username: "Meowweredoomed",
				content: [
					"It's been vetted by video analysis experts, computer imagery experts, and our intelligence agencies, and no one has found it to be fabricated.",
				],
				replies: [],
			},
		],
	},
	{
		username: "toastedgumball",
		content: [
			"The China one is fake, it has been debunked. It was originally posted on vimeo by meat dept, by 3 creators in Paris? They specialize in creating hyper realistic cgi videos",
		],
		replies: [],
	},
	{
		username: "MKULTRA_Escapee",
		content: [
			"The original source for China 2010 would be Meat Department, and I believe it didn't exist until 2015 when they created it. Hi res version: https://vimeo.com/135064694",
			"The China 2010 airport incident is its own thing and has nothing really to do with that CGI video. There are several photographs from the incident, most of which can be explained as long exposure shots of helicopters or planes of some kind.",
		],
		replies: [],
	},
	{
		username: "checkmatemypipi",
		content: [
			"Here's my fav, from 2009 captured by 2 different people",
			"https://www.youtube.com/watch?v=ZyqtXdLz3Go",
			"This is such a crazy one",
		],
		replies: [],
	},
	{
		username: "brendaifveclow",
		content: [
			"I believe the Turkey UFO is real. Though, at the same time I don't think we can actually see 'beings' in some glass cockpit. Just the mind making patterns. The full footage of the UFO itself though is some really weird shit.",
		],
		replies: [],
	},
];

function App() {
	return (
		<div>
			<For each={data}>{(comment) => <Comment {...comment} />}</For>
		</div>
	);
}

interface ComponentProps extends IComment {
	ref?: Ref<HTMLDivElement>;
	onMeasured?: (height: number) => void;
	onLayoutInvalidated?: () => void;
}

function Comment(props: ComponentProps) {
	let refContainer: HTMLDivElement | undefined;
	const refChildren: (HTMLDivElement | undefined)[] = [];

	const [isCollapsed, setIsCollapsed] = createSignal(false);
	const [railHeight, setRailHeight] = createSignal(0);
	const gutterSize = 32;

	const toggleCollapse = () => {
		setIsCollapsed((collapsed) => !collapsed);
		recomputeRailHeight();
	};

	onMount(() => {
		recomputeRailHeight();
	});

	const recomputeRailHeight = () => {
		let maxy = 0;
		for (const child of refChildren) {
			if (child) {
				const y = child.getBoundingClientRect().y;
				maxy = Math.max(maxy, y);
			}
		}
		const y = refContainer?.getBoundingClientRect().y ?? 0;
		const diff = maxy - y;
		setRailHeight(Math.max(gutterSize, diff + gutterSize / 2));

		// call *afer*
		props.onLayoutInvalidated?.();
	};

	return (
		<div
			style={{ "--var-gutter-size": `${gutterSize}px` }}
			class="flex flex-row"
			ref={(el) => {
				refContainer = el;
				if (typeof props.ref === "function") {
					props.ref(el);
				}
			}}
		>
			<div
				style={{ "--var-rail-height": `${railHeight()}px` }}
				class="relative flex flex-col items-center w-(--var-rail-size) h-(--var-rail-height)"
			>
				<button
					type="button"
					class="w-(--var-gutter-size) h-(--var-gutter-size) bg-red-200 rounded-full"
					onClick={toggleCollapse}
				>
					<div class="absolute -translate-x-full left-0 top-0 w-[calc(var(--var-gutter-size)/2)] h-(--var-gutter-size) flex flex-row items-center">
						<div class="h-[2px] bg-black grow"></div>
					</div>
				</button>
				<div class="bg-black w-[2px] grow" />
			</div>

			<div class="grow">
				<div class="bg-amber-200 h-(--var-gutter-size) flex flex-row items-center px-2">
					<div>{props.username}</div>
				</div>
				<div class="bg-blue-200">
					<For each={props.content}>{(content) => <div>{content}</div>}</For>
				</div>

				<Show when={!isCollapsed()}>
					<div class="bg-red-100 flex flex-col">
						<For each={props.replies}>
							{(reply, index) => (
								<Comment
									{...reply}
									ref={(el) => {
										refChildren[index()] = el;
									}}
									onLayoutInvalidated={recomputeRailHeight}
								/>
							)}
						</For>
					</div>
				</Show>
			</div>
		</div>
	);
}

export default App;
