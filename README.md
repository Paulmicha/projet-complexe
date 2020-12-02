# Projet complexe

## TL;DR

*"All [curation](https://twitter.com/plevy/status/716299155904311297) grows until it requires search. All search grows until it requires curation"* – [B. Evans](http://ben-evans.com/benedictevans/2016/1/31/lists-are-the-new-search)

This project gathers old ideas about an open-source web application for taking notes. Its functions / current objectives are :
* Research journal on very diverse subjects (personal archive)
* Private, public, multi-user with optional open access for collaboration, inspiration, discourse
* Organizing notes (relations, knowledge management, "archeology of knowledge", reflexivity) - including experimenting with automation (e.g. producing suggestions or generating relations) and mixing different indexes
* Data import/export (including periodically) and visualization
* Efficient interface [design](https://principles.adactio.com/) aiming for accessibility, progressive enhancement, and offline capabilities (+ installable app ?)

## General presentation

### Conception

Between 2009 and 2014, I started several projects which are now integrated into a single one ("projet complexe"). One started out of curiosity for History and interactive visualization of historical events, another focused on the findability of "memos" about practical knowledge (consisting in a collection and archive of instructions, guides and tutorials), and the last one was centered around the organization of concepts and ideas (their origins, development and interactions).

[![Combined architecture of past projects in the form of a simplified entity diagram, also representing Drupal-related entities.](readme/index/projet-complexe-diagrams-v01.png)](readme/index/projet-complexe-diagrams-v01.png)
Image above : combined architecture of past projects in the form of a simplified entity diagram, also representing Drupal-related entities.

### Design

The idea of merging different legacy projects - some of which having very different use cases - into a single one poses challenges for deciding how to approach the design of the interface. For now, I'm considering a conceptual categorization of the diverse contents available based on my own two main intentions to use this application : achieving tasks (getting things done), and learning (improving and extending knowledge).

How this duality translates into interface design choices is not very clear yet (i.e. selectable modes re-arranging the layout and/or functions available), but here's a list of terms illustrating this concept of "duality of use" when using the app to search :

Knowledge-oriented | Task-oriented
--- | ---
Problem | Solution
Exploration / Digression | Goal / Focus
Complexification | Simplification
Design (projection) / Concept | Execution / Implementation / Realization
Research / Reflection / Opinion | Decision
Analysis / Explanation | Directives / Tasks
Anticipation | Reaction / Adaptation
Theory | Practice
Information | Command
Thought | Action

In any context, I'm hoping to experiment with visualization ideas specific to current intent ("orientation").

## License

Source code is [GPLv2](LICENSE).
All content is [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/), unless otherwise stated.
