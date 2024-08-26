import { LevelCells, SavedLevelInfo } from "./Level";
import { unpackLevel, unpackLevelCells } from "./algorithms/pack";

export let sharedLevel: (SavedLevelInfo & LevelCells) | null = null;

const url = new URL(location.href);
const id = url.searchParams.get("id");
const data = url.searchParams.get("data");
if (id && data) {
    const [levelInfo, packedCells] = unpackLevel(
        decodeURIComponent(data),
        id,
        false,
    );
    const cells = unpackLevelCells(packedCells, levelInfo);
    sharedLevel = {
        ...levelInfo,
        cells,
    };
    url.searchParams.delete("id");
    url.searchParams.delete("data");
    history.pushState(null, document.title, url.pathname);
}
