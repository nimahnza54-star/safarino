/**
 * One-shot asset self-hosting: downloads every remote image referenced by the
 * app into public/assets/ so the frontend has no third-party image dependency.
 * Verifies Content-Type is an image before writing.
 *
 * Run: node scripts/download-assets.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "assets");
mkdirSync(outDir, { recursive: true });

const BASE = "https://lh3.googleusercontent.com/aida-public/";
const assets = [
  // Hotels
  ["hotel-tehran-01.jpg", "AB6AXuCxA53IjNeihYHk2fSRpHBJsCsuCYKb0aWGwIK5AQlCpNWxSthHHZBVYkdaeOSiknG-MNc5hjt5lpAt5XDwlDELZ4QHKok6rLOFFvRF-fZ0J5kitHXfvh07mTvWa2GC7lmMz8oNQnYG91i-4Vc0BEw4H1W__8HYeeolSBTlu84aUjdTNyADJ_QCy0iZWvIccUqiMxS4OtSdKiypZirAfEt6X2N6czuBGw4Hd0dmxQ"],
  ["hotel-mashhad-01.jpg", "AB6AXuBrrjxVxlb9-yz4_aB2cxiDlem-cd5b_jv6Aj4GOqo63XBGwdR8PSU14iUyO6Fw2ztmw6FYEG7crV6PSOnnu381ynORS6ixweg1dVsCxMooUpJSMQ60QgzbccfETmOfv03Of0NDWnFf-5BChj9ZqzyO-4RwBne4U4EduWksZl-zEfyLtpepw6UEdM8XVhtCK6Jzm-tNY2b5UapgODvgowqxbLtubSUCYjtz-tNY5g"],
  ["hotel-shiraz-01.jpg", "AB6AXuBrZVtiBEdc_8Y3ZK0mxI2M7duniIGakFN8kAFmi8jJy1X63jQn1-NQnaV7JwOKnBuUxnJqEey_m4TSKzYuyUGBfRngFN5W8F_gezMgJG0cxkrwhj5w7A1QM3yGVOM-vCipWcFshzK7JIZEZI8uJuwd82qSy6OD6i18PKjOmQ2hiZ7GbibCvOcGad26EfVOtmReoinW3SDdMfNLrV0V5D4zn5CQ65Ipp3wzyNoJ5g"],
  ["hotel-hamedan-01.jpg", "AB6AXuAQFmIkYbeQXgaXHYPtBnL1t7PBBBvwInOOsAuHbBBZ5yO5iUCd_7_Kzsf7Wrx4S-hdZGnj3UUh4LzQdDwGZJC4DSs25i6aUilbAgq0XNzdjCMZLwF4EeKm2Yx1dt01E9gPsnMLXR-b4EuRUH3vMpMyxuN18cBBSUYGoL2pGIme9uatVDERKfffmuQohClywNnCNWwsH3h9b4PqbdHvKWQxIKmLmt0uhJE4FqnHeQ"],
  ["hotel-mazandaran-01.jpg", "AB6AXuDH-5QUbTVgD52JPlZXMvrAH7k1-vdhFRZak-GjCX0VI2rha2-Jrsbx8KKdvI5ZLlkLwgzzU0OCr_hH-gL_dfVaMslriYyT2lp7bJ2z_qYJ2APqPU0QdDSo-nO1tT9L0-sHyH1SzZCt5M0IBjQoYu4l4gPqMnx1Cyha0slrt2_0RkMwnxo_-bMiZSrV-fRiMPz2TuUg1b1PzcrnI4lwkIxx0biHZe5S3jAF5b6SxA"],
  ["hotel-mashhad-02.jpg", "AB6AXuBgJ-m0IlxwMhIuFBo7RdzXUfp7Xg9LQ5K1C3u4OOT46MU9g3ticWwjFymZsLZoAZ2mvY00SumDMpQOSs1O-Udk-juq4nRezQfyRVLTjwpM3xjKbxlRWFadHYS4fQuEvo5kP9SkLkgKao3v4a41y67mFKcp_z8bxcTOSH4II7xDyxwskxDdB8e6ewOYMP0kQsXgtE5zIIqvctWHd-S5r73z8tkUqGB-iAMr42GJCg"],
  ["hotel-yazd-01.jpg", "AB6AXuCVL0OHcTMHfPl6kzoh0jb8osWgC3Gj5i2FaUtwAetAOhY3SpEQkjY2aXHSlhQwCD-fhDWGH2dIJD87UJmilVtcILo85b-cR7Le3nqD_x1ej140Y1KV-htCEgDyBsMVOsJwiXl17YtCF_GWRd3iDIYX8hZU4BcKgLgXOzfvH4-nT1M4BOKV002gv5aPr7DzuxITJUcmC8Gra8jwbQO3llQemjLhPdE6J21nZbqAdw"],
  ["hotel-kish-01.jpg", "AB6AXuA0kzyEv1oh5XHxtCeMVrI2VO1EdTGgwVaUTqlJix6e03bsc6mKlL3Qj3_JNdTh6b60JomjGZ6iVnnBNkMTeKmNSJhfp8Q7VD4hFXqRMSUCSIRrgvpsXgVYoHDP2jY1U_Bv198BZPbIRwRuvIvIxG-ifXk92LFq-ErFDloU6wRhU057xo_LgtkekPJfmUgXqGEPd8RDMVWSqDqCI3sJe4Ue_jtTyjD9PQ51yrBAqA"],
  // Platform features
  ["feature-automation.jpg", "AB6AXuAlTO6GOYQEIrXnS_5UhxUgdC_3-ZZLu-7Cf0uNkhahD2IV1THyuOVtBdo9QJCjZFCcaq6zv5mrW6hLQNCCqgrGudK9TAARxPoAKzm8V4lt2_8_Ah6NqA37l15QhYFzoP8l8EtOIipTMKycOcrap0GKMTyG-D2n-FTlgTO3fEdEwM9xYlD6maOD1RYT7cQ03YZxnKsMJXgRdbcmAVHeswxhRe-XcbW4IStR5gGAbw"],
  ["feature-rewards.jpg", "AB6AXuCfidui21759IBgt7pT9kLgHJS1tSYH9EU8MysIFVFaeoMC-TMvQKzfSB8ovUFYlBqC0JJAMYRP5EdmPVPQQ3hbqUqkGsr42ZaErvRs52_wfP_HKPUQ0e8dcMjzl2PjDUnbkF5x_wApOyhNBPqIKjxIhjoJBoQ82dvEMLNHXoa102GeZf802-c6-ER_HlgjOR04BaGbi1yc8vPCZbJTU0YjyDGJmxTnOzndEcxN3Q"],
  ["feature-hosting.jpg", "AB6AXuBb8gOP1SKe-pL3iPj6pUb-Ht8xHyBVL5dkY7yjH1GzueNryCxguDEc9FBox9B4jMIzXy4g59CSMwkbIfLGSmF9oMd5vHi2cX9eai8Z3Wqgyk4Rm1GQCYBWoOvcOycOeknNrVP5rl9aqdfRxKAo2k3XG83_7_SRNsIlJTk20RfHtGgQrXRDLV8RRPWaDQXOhEOvv6rO00U_ZemFJdKEPEXiCIhkj3dKEpKQCpB_cw"],
  ["feature-platform.jpg", "AB6AXuD_DiKcKQDhnvlly2UZZBOggCP1WcpcVFSSFnRnXKdb3xJCKhb46NQMFdanhribpdW1f_R2QK1awf7wIcjNAsCJ3hcVjY6Gtx5bZBo3a5iV_seLi2X3oIv1s7Oi3Xrw86ZfPkpikyqyqSiogAcNj9uGTCqPnRLAFe6XTcHyUB9pXWFj97kKB4PVSwafNwR0Zy0ZuXgMqu5ZPoytTtnl-DfR9d9PQdyC36zdh_k47w"],
  // Travel cards
  ["travel-card-employee.jpg", "AB6AXuDM3a99CGzhydsdwpgOR4kAjAMDKJBsniazw_GDN1VdiYYQm23L_yvQsiibE8QSg8bYIzijpKcF5FWL-qMvEjNruOTk72Tkr_FC4K4IVPjKZOFePJJnatAEJD8eeqvrgVfyS9aAqo82CeWaOTem9c9NSBnTBAX_aqSbXdleIdz5dWIfyrRWMpvDMzuMJGYfyDO8XTTiovZuneavmaF8_63KLgedpG2uOXBpg3CJdQ"],
  ["travel-card-corporate.jpg", "AB6AXuCfjpfCtY-GEfse38UiCcwfR6nxSsG8z0CPjUesBqyd0B10q3XjNO-pMd2X9GlMLVxU5zOhnnYFK7IjgU3qqzODTy3hrsmTt0kTkaMpoet6cZ7GeD6U51VD_feaypeUopNqf6xv5bX2LjiZRE23GYg1akgJYMGTg8z3F5BzKPTTtXXxnlefefL278t2buaLT-HFA1_2BR6jGQ58bZfh0WHIt8kmXs8q3s1ke0WRjw"],
  // App promo
  ["app-promo.jpg", "AB6AXuD4uLWkqekb8Uw2zoK5uDXKn7bH_zd1YCz5i6tY4M8XhCIiFnkrm-7ptUdZ9ezKBEvJysjRs-959gmkO7qGszFu8gwSdi2VgvjevYd5XoHVFfmP2Esgo7MzGsd7T9CX_Q9uBkcYVXSCH0NU3D7aPb8XSsfCQBj5J17w7DInKly02SrqaBi_c-EfXvkWcXK8K3hs0AaP8k-e-wKax071IcZLIlr5dMijWUWLfLUr_Q"],
  // Blog
  ["blog-mashhad.jpg", "AB6AXuAcvryV66bKPHCsPOmIoTnGeTw-NSeYEmd5dccO8mtTsexYHP2cN5JDjz8F7XFHzT9aVe76tGomAQh9BJmGC8dSXzbueGsaPBYgPC0TBUPSGg4VRlPC8sC03V2MJLuRgkTJv5ckZg8fpARN8rtQou2Zu6KZnsAPmAOm6WkB6yguh7yYDkWLoshBrDLVT_BSbc6KLKVrmd4ZOoOl7KIGYq5VUcO9EaiACNZcMzSJng"],
  ["blog-yazd.jpg", "AB6AXuDiNeHBOKEGQA2LuEO-o4xV0XnpATannt0RkFKvSeRqzolrzPDXedM66pdAiNeM5kICHKUdFkGUUqAyqt8xZzKAZi0Wzu5VpEyImSPnmXG67pqSX2jeqQk3wFdNKCkPdDfQngl_18bcWnjAIj6hrW_ipYaMWdQ2_PVjKX0K8kw6Qpd7WmXVSAvs7KtUb_kHO3xQsRJf45V4lAh9UOd9BY1Jb-sjaN7-g3mf6w4E2w"],
  ["blog-kish.jpg", "AB6AXuB3f5cs93S58EiWWkZrSzKOxo2MjgD5HODJPSwlxUThYuGezlvye7gPAC77kk7oTVln1Zqw6l2EUqGIJOl6F_CCebtc_AeU3RE8VUYOiv9GGVVZfDj4wu8vSCtM51kCLwujBrOM3nlF5HeR6enTZPODDpch8cnoDROOHP3KUdCj90Eie7EkNTo_ghSt_OqAb0Fgfm-y80r1BxynUYQzoNOvNYvUps53ryEMJPnjrg"],
  ["blog-mazandaran.jpg", "AB6AXuACQML9Wrr4x1beU8I0n0ILXzLsRwiAWoIJqQYG3_5sSSQJx3a7scZyWMUmqZ8IaBc4ksmdgFwjaTsaQhTADhpqZyZ-HBn9J00W26XrBF7-1ONT3B_DtHGz6cVECdEZthb-0wvDqKDiHP80EjWf-XD4s8KDYYAMUghKUUerE6AFaf1W93ZU6G6LrJDPvxxeApKPqP82UdM49KZ2OrHuncn3XEZJX4wq1ENkiF2X9A"],
];

let failures = 0;
for (const [filename, id] of assets) {
  const target = join(outDir, filename);
  if (existsSync(target)) {
    console.log("skip (exists)", filename);
    continue;
  }
  const res = await fetch(BASE + id);
  const contentType = res.headers.get("content-type") ?? "";
  if (!res.ok || !contentType.startsWith("image/")) {
    console.error(`FAILED ${filename}: status=${res.status} content-type=${contentType}`);
    failures++;
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(target, buffer);
  console.log(`wrote ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
}
if (failures > 0) {
  console.error(`${failures} asset(s) failed to download`);
  process.exit(1);
}
console.log("All assets self-hosted in public/assets/");
