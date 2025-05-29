import type { Location } from '@wyw-in-js/shared';
export default function stripLines(loc: {
    end: Location;
    start: Location;
}, text: string | number): string;
