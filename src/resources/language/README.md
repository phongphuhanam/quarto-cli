## Quarto Localization

In some circumstances Quarto, Pandoc, and LaTeX will generate textual output that requires localization. For example, "Figure" or "List of Figures" for cross references, callout captions like "Note" or "Warning", or the "Code" caption for folded code chunks.

This directory includes a set of built-in translations, including:

| File               | Language          |
| ------------------ | ----------------- |
| `_language.yml`    | English (default) |
| `_language-zh.yml` | Chinese           |
| `_language-es.yml` | Spanish           |
| `_language-fi.yml` | Finnish           |
| `_language-fr.yml` | French            |
| `_language-ja.yml` | Japanese          |
| `_language-de.yml` | German            |
| `_language-pt.yml` | Portuguese        |
| `_language-ru.yml` | Russian           |
| `_language-tr.yml` | Turkish           |
| `_language-cs.yml` | Czech             |
| `_language-nl.yml` | Dutch             |
| `_language-pl.yml` | Polish            |
| `_language-it.yml` | Italian           |
| `_language-kr.yml` | Korean            |

The use of these translations is triggered by the [`lang`](https://pandoc.org/MANUAL.html#language-variables) Pandoc metadata variable, which identifies the main language of the document using IETF language tags (following the [BCP 47](https://tools.ietf.org/html/bcp47) standard), such as `en` or `en-GB`. The [Language subtag lookup](https://r12a.github.io/app-subtags/) tool can look up or verify these tags.

For example, this document will use the built-in French translation file by default:

```yaml
---
title: "My Document"
lang: fr
---
```

## A Note on Gender for the Author-based Values

The `title-block-author-single` and `title-block-author-plural` keys refer to a hypothetical author or set of authors and the word "author" can have different masculine and feminine forms across locales. We endeavor to follow the relevant guidance put forward by the Unicode Consortium in Unicode Technical Standard #35 (https://www.unicode.org/reports/tr35/tr35-45/tr35-general.html#List_Gender). This involves having the forms for male-singular, female-singular, male-plural, female-plural, and mixed-neutral. The cross-locale data that supports this guidance can be found within the (cldr-json GitHub project)[https://github.com/unicode-org/cldr-json/blob/main/cldr-json/cldr-core/supplemental/gender.json]. The CLDR (Common Locale Data Repository) project is a Unicode project that is the going standard for localization. While the data is currently in an emergent state, it should eventually cover the bulk of the locales that CLDR supports (and Quarto as well) and it promises to be continuously maintained in a consensus-based manner.

## Contributing Localizations

We welcome contributions of additional languages! To contribute a localization:

1.  Make a copy of the `_language.yml` file with the appropriate IETF language tag appended to the filename (e.g. `_language-fr.yml`).

2.  Translate the English strings therein to the target language.

3.  Submit a [pull request](https://help.github.com/articles/using-pull-requests) with your new language translation. Before doing this please ensure that you have signed the [individual](https://rstudioblog.files.wordpress.com/2017/05/rstudio_individual_contributor_agreement.pdf) or [corporate](https://rstudioblog.files.wordpress.com/2017/05/rstudio_corporate_contributor_agreement.pdf) contributor agreement as appropriate. You can send the signed copy to [jj\@rstudio.com](mailto:jj@rstudio.com).
