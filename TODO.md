# TODO

- [x] Update `components/ui/SearchAutocomplete.tsx` Tailwind classes + layout containers to make dropdown responsive:
  - [x] Stack “Recent” above “More Results / Live Suggestions” on mobile/tablet, side-by-side on `md:`+
  - [x] Ensure absolute drop panel uses full width on mobile (`w-full left-0 right-0`)
  - [x] Adjust padding to avoid compressing text on mobile (reduce `px-6/p-6` to `px-4 md:px-6` / `p-4 md:p-6`)
  - [x] Increase vertical padding for tap targets (`py-3 md:py-2`) and ensure truncation/line-clamp for long strings
  - [x] Ensure “Did you mean” block spans full width and stacks correctly on mobile
- [ ] Manually verify responsive behavior for mobile/tablet/iPad + desktop.
