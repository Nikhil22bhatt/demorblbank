---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-19T07:23:44Z
  againstInput: https://www.rbl.bank.in/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.rbl.bank.in/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-19T07:23:44Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated 2026-11-19T07:23:44Z by the run invocation (--hands-off). Scope: exactly the 5 pages of
stardust/.labs/site-plan.json (no caps apply; nothing outside the plan is migrated).
Gate breakpoints: desktop,mobile → 1440, 360. Named assumptions: publish decision = publish;
martech carried over with every contract part disabled (owner decision recorded in the run brief).
First-page-first not used: a 5-page scoped run, not a full-site run.

## Link audit — out-of-scope targets repointed to the source site (2026-11-19)

Decision (E2, SCOPE EXTENSION): declared scope is exactly /, /about-us, /business-banking, /personal-banking,
/contact-us (+ chrome /nav, /footer). Every root-relative <a href> outside it is repointed to
https://www.rbl.bank.in<path+query+hash> regardless of count; no capture gaps (no in-scope target was uncaptured).
Helper: stardust/.work/rollout/probes/repoint-out-of-scope.mjs (idempotent). 419 hrefs repointed,
209 distinct targets, 0 in-scope normalizations; per doc: about-us 4, business-banking 11, contact-us 7, footer 38, index 35, nav 307, personal-banking 17.
Republished all 7 docs (ledger stardust/deploy/ledger-link-audit.json); live internal hrefs: 0 broken.

Repointed targets (209):

- `/about-us/board-of-directors`
- `/about-us/leadership-team`
- `/account-aggregator`
- `/activation-credit-card`
- `/apply-form?product=Education-Loan&amp;LeadSource=website-hp-ourprod-education-loan&amp;utm_campaign=Loan&amp;utm_medium=Website&amp;utm_source=website-hp-ourprod-education-loan`
- `/auth-controls`
- `/banking-ombudsman`
- `/block-channel`
- `/blog`
- `/blog/banking/nri-banking/nre-vs-nro-vs-fcnr-complete-guide-to-nri-accounts-in-india`
- `/blog/banking/safe-banking/10-cybersecurity-tips-to-stay-safe-online`
- `/blog/banking/safe-banking/how-to-protect-your-device-from-apk-fraud`
- `/blog/banking/safe-banking/spoofed-calls-1600-series-how-to-protect-yourself`
- `/blog/banking/safe-banking/tips-for-identifying-genuine-bank-communications`
- `/business-banking/agri-banking`
- `/business-banking/agri-banking/agri-business`
- `/business-banking/agri-banking/developmental-banking-and-financial-inclusion`
- `/business-banking/business`
- `/business-banking/business-banking-group`
- `/business-banking/business/convenience`
- `/business-banking/business/partnering-your-growth`
- `/business-banking/business/partnering-your-growth/current-accounts`
- `/business-banking/business/specialised-packages`
- `/business-banking/credit-guarantee-schemes`
- `/business-banking/credit-guarantee-schemes/credit-guarantee-fund-trust-for-micro-and-small-enterprises`
- `/business-banking/credit-guarantee-schemes/national-credit-guarantee-trustee-company`
- `/business-banking/government-sponsored-scheme`
- `/business-banking/government-sponsored-scheme/agriculture-infrastructure-fund`
- `/business-banking/government-sponsored-scheme/maharashtra-chief-minister-employment-generation-programme`
- `/business-banking/government-sponsored-scheme/pm-street-vendors-atmanirbhar-nidhi-scheme`
- `/business-banking/government-sponsored-scheme/pm-vishwakarma-scheme`
- `/business-banking/government-sponsored-scheme/pradhan-mantri-formalization-of-micro-food-processing-enterprises-scheme`
- `/business-banking/government-sponsored-scheme/pradhan-mantri-mudra-yojana`
- `/business-banking/government-sponsored-scheme/prime-minister-employment-generation-programme`
- `/careers`
- `/certificates-issued-by-the-bank`
- `/chatbot`
- `/codes-and-policies`
- `/contact-us/customer-care`
- `/corporate-banking`
- `/corporate-banking/corporate-internet-banking`
- `/corporate-banking/rbl-mybizbank-app`
- `/corporate-banking/rbl-mybizbank-app?tabName=why-us`
- `/creditcard-pin-change`
- `/customer-knowledge-center`
- `/do-not-call`
- `/download-form`
- `/feedback`
- `/financial-inclusion-saturation-campaign`
- `/financial-literacy`
- `/gift-city`
- `/gift-city/alternate-investment-funds`
- `/gift-city/nri-pios-and-foreign-nationals`
- `/grievance-mechanism-flowchart`
- `/important-documents`
- `/india-startup-club`
- `/interest-rates`
- `/interest-rates?tab=fixed-deposit`
- `/interest-rates?tab=saving-account`
- `/investor-grievance-redressal`
- `/investor-relations`
- `/investor-relations/disclosures-regulation-46/intimations`
- `/investor-relations/regulatory/basel-capital-instruments-lcr-disclosures`
- `/locate-branch`
- `/locate-us`
- `/lodge-a-complaint`
- `/media-kit`
- `/news`
- `/nri-banking`
- `/nri-banking/deposits`
- `/nri-banking/deposits/fcnr`
- `/nri-banking/deposits/nre-deposits`
- `/nri-banking/deposits/nro-deposits`
- `/nri-banking/deposits/nro-tax-saver-fixed-deposits`
- `/nri-banking/deposits/rfc-deposits`
- `/nri-banking/deposits/yield-maximiser`
- `/nri-banking/home-loan-for-nri`
- `/nri-banking/money-transfer`
- `/nri-banking/money-transfer/foreign-currency-cheques`
- `/nri-banking/money-transfer/wire-transfers`
- `/nri-banking/nre-savings-account`
- `/nri-banking/nri-savings-account`
- `/nri-banking/nro-savings-account`
- `/nri-banking/portfolio-investment-scheme`
- `/nri-banking/seafarer-account`
- `/offers`
- `/offers-and-promotions/apply-spend-to-earn-amazon-vouchers-on-your-enterprise-debit-card`
- `/offers-and-promotions/attractive-offers-with-rbl-bank-credit-cards`
- `/offers-and-promotions/exclusive-festive-offer-existing-visa-enterprise-debit-cardholders-amazon-shopping-vouchers`
- `/offers-and-promotions?type=155356`
- `/offers-and-promotions?type=155357`
- `/offers?cat%5B0%5D=155365&amp;type=155356`
- `/offers?cat%5B0%5D=155406&amp;type=155357`
- `/offers?cat%5B0%5D=315494&amp;type=155356`
- `/offers?cat%5B0%5D=315494&amp;type=155357`
- `/offers?cat[]=245034&amp;type=155357`
- `/offers?cat[]=315494&amp;type=155356`
- `/offers?cat[]=315494&amp;type=155357`
- `/offers?type=155356&amp;cat[]=155365`
- `/offers?type=155357&amp;cat%5B0%5D=155362`
- `/offers?type=155357&amp;cat%5B0%5D=155406&amp;cat%5B1%5D=155407`
- `/offers?type=155357&amp;cat%5B0%5D=245009`
- `/offers?type=155357&amp;cat%5B0%5D=245034`
- `/personal-banking/accounts`
- `/personal-banking/accounts/safe-deposit-lockers`
- `/personal-banking/accounts/salary-account`
- `/personal-banking/accounts/savings-accounts`
- `/personal-banking/accounts/savings-accounts/digital-savings-account-prime`
- `/personal-banking/accounts/special-institutions-account`
- `/personal-banking/cards`
- `/personal-banking/cards/commercial-cards`
- `/personal-banking/cards/credit-cards`
- `/personal-banking/cards/credit-cards/shoprite-credit-card`
- `/personal-banking/cards/debit-cards`
- `/personal-banking/cards/forex-cards/voyedge-forex-card`
- `/personal-banking/cards/prepaid-cards`
- `/personal-banking/convenience-banking`
- `/personal-banking/convenience-banking/bharat-qr`
- `/personal-banking/convenience-banking/bhim-upi-rbl-bank`
- `/personal-banking/convenience-banking/bill-payment`
- `/personal-banking/convenience-banking/missed-call-facility`
- `/personal-banking/convenience-banking/online-tax-payments`
- `/personal-banking/convenience-banking/payment-gateway`
- `/personal-banking/convenience-banking/re-kyc`
- `/personal-banking/convenience-banking/self-service-kiosk`
- `/personal-banking/convenience-banking/tax-payments/direct-tax/?tabName=what-is-direct-tax`
- `/personal-banking/convenience-banking/verified-by-visa-secure`
- `/personal-banking/demat`
- `/personal-banking/forex-services`
- `/personal-banking/forex-services/outward-remittance`
- `/personal-banking/insurance`
- `/personal-banking/insurance/general-insurance`
- `/personal-banking/insurance/health-insurance`
- `/personal-banking/insurance/life-insurance`
- `/personal-banking/investment`
- `/personal-banking/loans`
- `/personal-banking/loans/business-loan`
- `/personal-banking/loans/car-loan`
- `/personal-banking/loans/easygain-overdraft`
- `/personal-banking/loans/education-loan`
- `/personal-banking/loans/housing-loan`
- `/personal-banking/loans/loan-against-gold-ornaments`
- `/personal-banking/loans/loan-against-property`
- `/personal-banking/loans/loan-against-securities`
- `/personal-banking/loans/personal-loan`
- `/personal-banking/loans/rural-vehicle-finance`
- `/personal-banking/loans/small-and-micro-loan-against-property`
- `/personal-banking/loans/two-wheeler-loan`
- `/personal-banking/term-deposits`
- `/personal-banking/term-deposits/ace-fixed-deposit`
- `/personal-banking/term-deposits/digital-fixed-deposit`
- `/personal-banking/term-deposits/flexi-sure-fixed-deposits`
- `/personal-banking/term-deposits/money-max-deposits`
- `/personal-banking/term-deposits/raksha-kavach-fixed-deposits`
- `/personal-banking/term-deposits/recurring-deposits`
- `/personal-banking/term-deposits/regular-fixed-deposits`
- `/personal-banking/term-deposits/senior-citizen-wealth-secure-fixed-deposits`
- `/personal-banking/term-deposits/smart-recurring-deposit`
- `/personal-banking/term-deposits/super-senior-citizen-akshay-nidhi-fixed-deposits`
- `/personal-banking/term-deposits/tax-savings-fixed-deposits`
- `/personal-banking/ways-to-bank`
- `/personal-banking/ways-to-bank/bank-by-person`
- `/personal-banking/ways-to-bank/internet-banking`
- `/personal-banking/ways-to-bank/mobile-banking`
- `/personal-banking/ways-to-bank/rbl-cares`
- `/personal-banking/wealth-management`
- `/personal-banking/wealth-management/3-in-1-account`
- `/personal-banking/wealth-management/alternate-investment-products`
- `/personal-banking/wealth-management/e-asba`
- `/personal-banking/wealth-management/mutual-fund`
- `/personal-banking/wealth-management/national-pension-system`
- `/preferred-banking`
- `/preferred-banking/aspire-banking`
- `/preferred-banking/insignia`
- `/preferred-banking/insignia-banking`
- `/preferred-banking/signature-banking`
- `/press-releases`
- `/propose-your-property`
- `/quick-services`
- `/report-a-fraud`
- `/report-loss-or-unautho-use-of-credit-card`
- `/report-loss-or-unautho-use-of-debit-card`
- `/service-charges`
- `/site-map`
- `/social-responsibility`
- `/static-pages/gpay`
- `/static-pages/manage-recurring-merchant-payments`
- `/static-pages/positive-pay`
- `/static-pages/report-loss-or-unauthorised-use-of-credit-card`
- `/static-pages/report-loss-or-unauthorised-use-of-debit-card`
- `/static-pages/samsung-pay`
- `/static-pages/ways-to-generate-debit-card-pin`
- `/sustainability-framework`
- `/terms-and-conditions`
- `/trust-and-beyond`
- `/unclaimed-deposit-services`
- `/wholesale-banking`
- `/wholesale-banking/clients`
- `/wholesale-banking/clients/commercial-banking`
- `/wholesale-banking/clients/corporate-banking`
- `/wholesale-banking/clients/financial-institutions-group`
- `/wholesale-banking/clients/government-banking`
- `/wholesale-banking/clients/inclusive-finance-institutions`
- `/wholesale-banking/clients/multinational-corporates`
- `/wholesale-banking/products-and-services`
- `/wholesale-banking/products-and-services/corporate-finance`
- `/wholesale-banking/products-and-services/financial-markets-and-treasury`
- `/wholesale-banking/products-and-services/transaction-banking`
- `/wholesale-banking/products-and-services/wholesale-client-services`
