export const demoPersonStatuses = [
	"relationship",
	"complicated",
	"single",
] as const;

export type DemoPersonStatus = (typeof demoPersonStatuses)[number];

export type DemoPersonSeed = {
	firstName: string;
	lastName: string;
	age: number;
	visits: number;
	progress: number;
	status: DemoPersonStatus;
};

export type Person = DemoPersonSeed & {
	id: number;
};

export const demoPeopleSeed: DemoPersonSeed[] = [
	{
		firstName: "Ava",
		lastName: "Chen",
		age: 28,
		visits: 342,
		progress: 76,
		status: "relationship",
	},
	{
		firstName: "Noah",
		lastName: "Patel",
		age: 34,
		visits: 118,
		progress: 42,
		status: "single",
	},
	{
		firstName: "Mia",
		lastName: "Rivera",
		age: 31,
		visits: 529,
		progress: 91,
		status: "complicated",
	},
	{
		firstName: "Leo",
		lastName: "Wang",
		age: 25,
		visits: 87,
		progress: 33,
		status: "single",
	},
	{
		firstName: "Sophia",
		lastName: "Kim",
		age: 39,
		visits: 261,
		progress: 64,
		status: "relationship",
	},
	{
		firstName: "Ethan",
		lastName: "Miller",
		age: 45,
		visits: 712,
		progress: 58,
		status: "complicated",
	},
	{
		firstName: "Luna",
		lastName: "Garcia",
		age: 22,
		visits: 154,
		progress: 88,
		status: "single",
	},
	{
		firstName: "Oliver",
		lastName: "Smith",
		age: 37,
		visits: 403,
		progress: 47,
		status: "relationship",
	},
	{
		firstName: "Isabella",
		lastName: "Brown",
		age: 29,
		visits: 231,
		progress: 69,
		status: "single",
	},
	{
		firstName: "Lucas",
		lastName: "Jones",
		age: 41,
		visits: 355,
		progress: 52,
		status: "complicated",
	},
	{
		firstName: "Emma",
		lastName: "Davis",
		age: 33,
		visits: 624,
		progress: 83,
		status: "relationship",
	},
	{
		firstName: "James",
		lastName: "Wilson",
		age: 27,
		visits: 96,
		progress: 25,
		status: "single",
	},
];
