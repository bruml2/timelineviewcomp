## The TimelineView Component

### The div#timelineViewContainer (root).

It's offsetWidth/clientWidth (no border) is 1300px by default or set by the parent with a prop. It's height is sufficient to contain its children.

### The div#tvTimeline container and the svg#svg container.

Within the timelineViewContainer are three divs with a width of 98% (default clientWidth: 1268):
  - [a dev-only prolog which displays the values of the tl (timeline) properties;]
  - the tvHeader to contain the title and subtitle of the timeline; it can also contain any checkboxes to vary the display (e.g., no-labels);
  - the tvTimeline container (with position: relative for absolute positioning of era labels); 
  - a footer;

The offsetWidth of the tvTimeline is 98% of the timelineViewContainer:
 - default offsetWidth: tcv: 1300, tvt: 1274
 - default clientWidth: tcv: 1300 (no borders), tvt: 1268 (3px border)
 
The timeline container's children are:
  - an svg with the shapes for the timeline, and the time axis; the svgWidth is tvTimeline width [.offsetWidth] less two svgSideMargins(25).
  - a series of html divs for era labels, ...

### The svg#svg container.

The svg element has "margins" of 20 on each side so its clientWidth is 1228 (40 less than the tvTimeline clientWidth of 1268).

The height of the svg determines all the parent container heights. The default height of the svg container is 400 (eraTopMargin: 30; eraHeight: 316; timeAxisHeight:50); it can be increased/decreased by modifying the eraHeight value.

### Changing the size of the timeline.

The height of the timeline can be changed by setting the tl.eraHeight. This will permit more vertical space for ranges, events, etc.

Dramatic changes to the default width will require some sort of non-trivial scaling (including font-sizes) to be worked out later.

## Timeline elements: eras, ranges, events.

### Eras.

An era is used to show some sort of background condition. In the biblical timeline, they show the large-scale periods used by scholars. In a timeline showing the history of a country they might show wars, reigns, etc.

An era is specified with four required properties: 1) a *label* which is normally displayed centered just below the top of the era; 2) a *start year*; 3) a *stop year*; and 4) a *bgcolor* to make the era stand out to the intended extent.

#### Era Labels.

The era labels are HTML divs which are absolutely positioned against the tvTimeline div.

### Identifying multiple instances of TimelineView on one page.

It's necessary to assign a unique ID to the root component of each instance of the component so that the JS which draws the timeline can target the correct svg element. This is done by passing a different componentID prop to each instance. 