# Author Code System

5-character codes that uniquely identify bill authors/co-authors across congresses. Used in the `authors` reference table and the `author`/`coAuthor` columns of the `bills` table.

## Format

```
[SURNAME_CHARS][FIRSTNAME_CHARS] = 5 characters total
```

The number of characters taken from each part depends on the length of the first name component:

| First name length | Surname chars | First name chars | Example |
|-------------------|---------------|------------------|---------|
| 4+ letters        | 1             | 4                | CAYETANO, PIA → C + AYET → **CAPIA** |
| 3 letters         | 2             | 3                | KHO, ARA → KH + ARA → **KHARA** |
| 2 letters         | 3             | 2                | SUAN, LO → SUA + LO → **SUALO** |
| 1 letter          | 4             | 1                | — (rare) |

## Encoding (Name → Code)

Given a full name in `SURNAME, FIRSTNAME MIDDLE SUFFIX` format:

### Step 1: Normalize the name

1. **Strip suffixes** from the surname/name: JR, JR., SR, SR., II, III, IV, V
2. **Strip titles**: COMPANERA, COMPANERO
3. **Remove quoted nicknames**: `"BONG"`, `"KIKO"`, etc.
4. **Remove single-letter initials**: middle initials like `G.`, `M.`, etc.
5. **Extract alpha characters only** (drop periods, hyphens, spaces)

### Step 2: Identify surname and first name word

- **Surname**: Take the first word of the surname portion (before the comma). For hyphenated surnames (e.g., `CO-PILAR`), use the full hyphenated form but extract alpha only → `COPILAR`.
- **First name**: Take the **first significant word** of the first name portion (after the comma). This is typically the legal first name.

### Step 3: Apply the length formula

```
first_name_alpha = alpha-only characters of the first name word
surname_alpha    = alpha-only characters of the surname word

if len(first_name_alpha) >= 4:
    code = surname_alpha[0:1] + first_name_alpha[0:4]
elif len(first_name_alpha) == 3:
    code = surname_alpha[0:2] + first_name_alpha[0:3]
elif len(first_name_alpha) == 2:
    code = surname_alpha[0:3] + first_name_alpha[0:2]
elif len(first_name_alpha) == 1:
    code = surname_alpha[0:4] + first_name_alpha[0:1]
```

Result is always uppercase, always exactly 5 characters.

### Example walkthrough

```
Input:  PANGILINAN, FRANCIS "KIKO" N.
  1. Strip nickname "KIKO" → PANGILINAN, FRANCIS N.
  2. Strip initial N. → PANGILINAN, FRANCIS
  3. Surname alpha: PANGILINAN → first word = PANGILINAN
  4. Firstname alpha: FRANCIS (7 chars, ≥4)
  5. Code = P(1) + FRAN(4) = PFRAN
```

## Decoding (Code → Name)

Codes are not reversible to full names algorithmically. Use the `authors` table as a lookup:

```sql
SELECT name FROM authors WHERE code = 'PFRAN';
-- Returns: PANGILINAN, FRANCIS "KIKO" N.
```

The `authors` table stores the fullest known name variant for each code.

## Known exceptions

The standard algorithm covers the majority of entries. However, some codes were generated using **non-first-name words** (middle names, nicknames, or commonly-known names) for disambiguation or identification. These are manual overrides and cannot be derived algorithmically.

| Pattern | Example | Explanation |
|---------|---------|-------------|
| **Nickname used** | DINNO = DY, FAUSTINO "INNO" → D + INNO | Person commonly known by nickname |
| **Skip MA.** | CCYNT = CHAN, MA. CYNTHIA → C + CYNT | MA. treated as honorific, skipped |
| **Middle name used** | RMART = ROMUALDEZ, FERDINAND MARTIN → R + MART | Person known by middle name |
| **Special assignment** | AARJO = ATAYDE, JUAN CARLOS "ARJO" | Conflict resolution (AJUAN taken) |

These exceptions exist in the `authors` table and should always be resolved via lookup rather than algorithm.

## Multi-author format

When multiple authors appear in the `coAuthor` column, their codes are stored as a comma-separated string:

```
PFRAN, TERWI, CAPIA
```

Each code maps to one entry in the `authors` table.

## Code conflicts

A single code may map to different people across Senate and House bills (e.g., `MFERD` refers to both MARCOS, FERDINAND "BONGBONG" R. in the Senate and MARCOS, FERDINAND ALEXANDER A. in the House). The `authors` table holds the first-registered entry; context (bill type) disambiguates.
