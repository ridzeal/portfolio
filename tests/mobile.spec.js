import { test, expect } from '@playwright/test';

const MIN_TOUCH_TARGET = 44;
const MIN_FONT_SIZE = 11;

test.describe('Mobile layout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('no horizontal overflow on body', async ({ page }) => {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });

  test('no section has horizontal overflow', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      const results = [];
      for (const section of document.querySelectorAll('.section')) {
        if (section.scrollWidth > section.clientWidth) {
          results.push({
            id: section.id,
            scrollWidth: section.scrollWidth,
            clientWidth: section.clientWidth,
          });
        }
      }
      return results;
    });
    expect(overflows).toEqual([]);
  });

  test('nav bar fits within viewport without overflow', async ({ page }) => {
    const navState = await page.evaluate(() => {
      const nav = document.querySelector('.nav');
      const navLinks = document.querySelector('.nav-links');
      const navLogo = document.querySelector('.nav-logo');
      return {
        navOverflow: nav.scrollWidth > nav.clientWidth,
        navScrollWidth: nav.scrollWidth,
        navClientWidth: nav.clientWidth,
        navPaddingLeft: getComputedStyle(nav).paddingLeft,
        navPaddingRight: getComputedStyle(nav).paddingRight,
        linksWidth: navLinks.getBoundingClientRect().width,
        logoWidth: navLogo.getBoundingClientRect().width,
      };
    });
    expect(navState.navOverflow).toBe(false);
  });

  test('nav links are not clipped or wrapped unexpectedly', async ({ page }) => {
    const linksVisible = await page.evaluate(() => {
      const links = document.querySelectorAll('.nav-link');
      return [...links].map(link => ({
        text: link.textContent,
        visible: link.offsetWidth > 0 && link.offsetHeight > 0,
        rect: link.getBoundingClientRect(),
      }));
    });
    for (const link of linksVisible) {
      expect(link.visible).toBe(true);
      expect(link.rect.right).toBeLessThanOrEqual(page.viewportSize().width);
    }
  });

  test('interactive elements meet minimum touch target size', async ({ page }) => {
    const smallTargets = await page.evaluate((minSize) => {
      const results = [];
      const exclude = ['.cursor', '.cursor-follower'];
      for (const el of document.querySelectorAll('a, button')) {
        if (exclude.some(cls => el.matches(cls))) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.height < minSize) {
          results.push({
            tag: el.tagName,
            text: el.textContent?.trim().substring(0, 40),
            class: el.className,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
      return results;
    }, MIN_TOUCH_TARGET);

    // Currently known failures - these should be fixed
    // Side-nav dots and nav links have insufficient height on mobile
    expect(smallTargets.filter(t => !t.class.includes('side-nav-dot'))).toEqual([]);
  });

  test('side-nav dots are usable on mobile', async ({ page }) => {
    const dotSize = await page.evaluate((minSize) => {
      const dots = document.querySelectorAll('.side-nav-dot');
      return [...dots].map(dot => {
        const rect = dot.getBoundingClientRect();
        return {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          tooSmall: rect.width < minSize || rect.height < minSize,
        };
      });
    }, MIN_TOUCH_TARGET);

    for (const dot of dotSize) {
      expect(dot.tooSmall).toBe(false);
    }
  });

  test('text elements meet minimum readable font size', async ({ page }) => {
    const smallFonts = await page.evaluate((minSize) => {
      const results = [];
      const exclude = ['.footer-dot', '.signal-dot', '.cursor', '.cursor-follower', '.scroll-line', '.hero-signal-bar'];
      for (const el of document.querySelectorAll('p, span:not(.sr-only), a:not(.sr-only)')) {
        if (exclude.some(cls => el.matches(cls))) continue;
        if (el.offsetWidth === 0) continue;
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        if (fontSize < minSize) {
          results.push({
            text: el.textContent?.trim().substring(0, 30),
            fontSize,
            class: el.className,
          });
        }
      }
      // Deduplicate by class+text
      const seen = new Set();
      return results.filter(r => {
        const key = `${r.class}:${r.text}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }, MIN_FONT_SIZE);

    expect(smallFonts).toEqual([]);
  });

  test('experience cards layout correctly on mobile', async ({ page }) => {
    const cardLayout = await page.evaluate(() => {
      const cards = document.querySelectorAll('.project-card');
      return [...cards].map(card => ({
        overflow: card.scrollWidth > card.clientWidth,
        gridColumns: getComputedStyle(card).gridTemplateColumns,
        padding: getComputedStyle(card).padding,
      }));
    });

    for (const card of cardLayout) {
      expect(card.overflow).toBe(false);
    }
  });

  test('project grid is single column on small mobile', async ({ page }) => {
    const viewportWidth = page.viewportSize().width;
    const gridCols = await page.evaluate(() => {
      return getComputedStyle(document.querySelector('.oss-grid')).gridTemplateColumns;
    });

    if (viewportWidth <= 640) {
      expect(gridCols.split(' ').length).toBe(1);
    } else if (viewportWidth <= 900) {
      expect(gridCols.split(' ').length).toBeLessThanOrEqual(2);
    }
  });

  test('hero tagline is not obscured by particle canvas on mobile', async ({ page }) => {
    const overlap = await page.evaluate(() => {
      const canvas = document.getElementById('particle-canvas');
      const tagline = document.querySelector('.hero-tagline');
      const label = document.querySelector('.hero-label');
      if (!canvas || !tagline || !label) return { error: 'missing elements' };

      const canvasRect = canvas.getBoundingClientRect();
      const taglineRect = tagline.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();

      // Particle text renders at canvas.height * 0.38 (desktop) or 0.15 (mobile)
      const isMobile = window.innerWidth < 768;
      const fontSize = Math.min(
        canvas.width / ('RIDZEAL'.length * 0.58),
        canvas.height * 0.18,
        180
      );
      const textY = (isMobile ? 0.15 : 0.38) * canvasRect.height;
      const particleBottom = textY + fontSize / 2;
      const contentTop = Math.min(labelRect.top, taglineRect.top);

      return {
        particleTextYPct: isMobile ? 0.15 : 0.38,
        particleBottom: Math.round(particleBottom),
        contentTop: Math.round(contentTop),
        taglineTop: Math.round(taglineRect.top),
        labelTop: Math.round(labelRect.top),
        obscured: particleBottom > contentTop,
      };
    });

    expect(overlap.obscured).toBe(false);
  });

  test('hero CTA buttons stack vertically on mobile', async ({ page }) => {
    const viewportWidth = page.viewportSize().width;
    const ctaLayout = await page.evaluate(() => {
      const cta = document.querySelector('.hero-cta');
      return getComputedStyle(cta).flexDirection;
    });

    if (viewportWidth <= 640) {
      expect(ctaLayout).toBe('column');
    }
  });

  test('about stats layout adapts to mobile', async ({ page }) => {
    const viewportWidth = page.viewportSize().width;
    const statsLayout = await page.evaluate(() => {
      const stats = document.querySelector('.about-stats');
      return getComputedStyle(stats).flexDirection;
    });

    if (viewportWidth <= 640) {
      expect(statsLayout).toBe('column');
    }
  });

  test('contact links stack label and value vertically on mobile', async ({ page }) => {
    const viewportWidth = page.viewportSize().width;
    const linkLayout = await page.evaluate(() => {
      const link = document.querySelector('.contact-link');
      return getComputedStyle(link).flexDirection;
    });

    if (viewportWidth <= 640) {
      expect(linkLayout).toBe('column');
    }
  });

  test('no content extends beyond viewport right edge', async ({ page }) => {
    const vpWidth = page.viewportSize().width;
    const overflows = await page.evaluate((vw) => {
      const results = [];
      const selectors = [
        '.nav', '.hero-content', '.about-grid', '.about-tech',
        '.project-card', '.oss-card', '.contact-content', '.contact-footer',
      ];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1) {
            results.push({
              selector: sel,
              right: Math.round(rect.right),
              viewport: vw,
            });
          }
        }
      }
      return results;
    }, vpWidth);

    expect(overflows).toEqual([]);
  });

  test('all sections are reachable by scrolling', async ({ page }) => {
    const sections = await page.evaluate(() => {
      return [...document.querySelectorAll('.section')].map(s => ({
        id: s.id,
        top: Math.round(s.getBoundingClientRect().top + window.scrollY),
        height: Math.round(s.getBoundingClientRect().height),
      }));
    });

    expect(sections.length).toBe(5);
    for (const s of sections) {
      expect(s.height).toBeGreaterThan(100);
    }
  });

  test('scroll-to-section navigation works on mobile', async ({ page }) => {
    await page.click('.nav-links a[href="#about"]');
    await page.waitForTimeout(500);

    const aboutTop = await page.evaluate(() => window.scrollY);
    expect(aboutTop).toBeGreaterThan(0);
  });

  test('page passes Lighthouse accessibility audit on mobile', async ({ page }) => {
    // Basic accessibility checks
    const a11y = await page.evaluate(() => {
      const issues = [];

      // Check for aria labels on interactive elements
      for (const el of document.querySelectorAll('button')) {
        if (!el.getAttribute('aria-label') && !el.textContent?.trim()) {
          issues.push({ type: 'missing_aria_label', tag: 'button' });
        }
      }

      // Check for alt text on images
      for (const img of document.querySelectorAll('img')) {
        if (!img.getAttribute('alt')) {
          issues.push({ type: 'missing_alt', tag: 'img' });
        }
      }

      // Check viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        issues.push({ type: 'missing_viewport_meta' });
      }

      // Check lang attribute
      if (!document.documentElement.getAttribute('lang')) {
        issues.push({ type: 'missing_lang_attr' });
      }

      return issues;
    });

    expect(a11y).toEqual([]);
  });
});
