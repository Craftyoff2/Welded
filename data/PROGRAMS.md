# Struktura studijních oblastí

- Otázky v dosavadní databázi patří do **Svářečák → MMA (Elektroda)**.
- **Svářečák → MAG (CO₂)** zobrazí otázky označené `"process": "MAG"` a společné otázky z kategorie `Bezpečnost`, jejichž `sectionTitle` uvádí metodu 135.
- Bezpečnostní otázky zkoušek, které mají platit pro MMA i MAG, ponechte bez `process`; objeví se v obou výběrech podle výše uvedeného pravidla.
- **Řidičáky → B, C, T** jsou zatím pouze připravené volby bez databáze otázek.
- Všech 30 technologických otázek MAG má doplněný klíč odpovědí. Otázky jsou označené jako neověřené, protože jejich správnost nebyla nezávisle potvrzena.

Příklad označení budoucí otázky pro MAG:

```json
{
  "id": "MAG-T-1",
  "process": "MAG",
  "category": "Technologie",
  "variation": 1,
  "sectionTitle": "Technologie MAG",
  "number": 1,
  "question": "Text skutečné otázky",
  "answers": ["Možnost A", "Možnost B", "Možnost C"],
  "correctAnswer": 0
}
```
