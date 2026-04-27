export function inView(node, options = {threshold: 0.5}) {
    const observer = new IntersectionObserver(([entry]) => {
        node.dispatchEvent(
          new CustomEvent('inview', {
            detail: entry.isIntersecting
          })
        );
      }, options);
    observer.observe(node);
    return {
        destroy() {
            observer.disconnect();
        }
    }
}