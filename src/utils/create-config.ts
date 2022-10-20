import { Linter } from 'eslint';

type RestrictProperties<Type, AllowList> = Type & {
	[Key in keyof Type]: (
		Key extends AllowList
			? Type[Key]
			: never
	);
}

export const createConfig = <
	Config extends Linter.Config,
>(
		config: RestrictProperties<Config, keyof Linter.Config>,
	) => config;
