/**
 * Normalise une valeur JSON libre en liste de lignes affichables.
 *
 * L'API peut renvoyer un tableau, une chaîne multiligne, un objet
 * (`{ description: "..." }`) ou une valeur nulle. On renvoie toujours
 * un tableau de chaînes pour éviter les erreurs du type
 * `(value ?? []).join is not a function`.
 */
export function toLines(value) {
    if (value === null || value === undefined) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.flatMap((entry) => toLines(entry));
    }

    if (typeof value === 'string') {
        return value
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
    }

    if (typeof value === 'object') {
        return toLines(Object.values(value));
    }

    return [String(value)];
}
