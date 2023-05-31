export const enumKeys = <E extends {}>(e: E): (keyof E)[] => Object.keys(e) as (keyof E)[];
