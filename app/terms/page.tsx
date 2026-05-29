import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — Sip",
  description:
    "The rules for using Sip — eligibility, acceptable use, content, and the legal bits.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      effectiveDate="May 28, 2026"
    >
      <p>
        These Terms of Service (the &ldquo;Terms&rdquo;) are an agreement
        between you and Sip, Inc. (&ldquo;Sip,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us&rdquo;) covering your use of the Sip mobile app, the Sip
        website at <a href="https://sipapp.co">sipapp.co</a>, and related
        services (collectively, the &ldquo;Service&rdquo;). By creating an
        account or using the Service, you agree to these Terms and to our{" "}
        <a href="/privacy">Privacy Policy</a>. If you don&rsquo;t agree, please
        don&rsquo;t use Sip.
      </p>

      <h2>1. Who can use Sip</h2>
      <p>
        Sip is for people who are <strong>21 years of age or older</strong>.
        By using Sip you represent that you are 21+, that you can form a
        binding contract with us, and that your use of the Service is not
        prohibited by any law that applies to you. If we learn that an
        account belongs to someone under 21, we will terminate it.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>Sign up with accurate information and keep it up to date.</li>
        <li>
          You&rsquo;re responsible for activity under your account and for
          keeping your credentials secure. Tell us immediately at{" "}
          <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> if you suspect
          unauthorized access.
        </li>
        <li>
          One human, one account. Don&rsquo;t impersonate anyone, sell or
          transfer your account, or create accounts for other people without
          their consent.
        </li>
      </ul>

      <h2>3. Your content</h2>
      <p>
        Sip lets you post photos, text, comments, events, crews, line reports,
        and other material (&ldquo;Your Content&rdquo;). You keep ownership of
        Your Content. You grant Sip a worldwide, non-exclusive, royalty-free
        license to host, store, reproduce, display, and distribute Your
        Content within the Service in order to operate it — for example, to
        show your post to your friends, display a line photo to nearby users,
        or contribute an aggregated wait-time estimate. When you delete Your
        Content, this license ends, except where already shared with others
        or retained in backups for a limited period.
      </p>
      <p>
        You represent that you have the rights needed to post Your Content
        and that it doesn&rsquo;t infringe anyone else&rsquo;s rights.
      </p>

      <h2>4. Acceptable use and community standards</h2>
      <p>
        Sip has zero tolerance for abusive users and for objectionable
        content. You agree not to, and not to help anyone else:
      </p>
      <ul>
        <li>
          Post content that is harassing, threatening, hateful, sexually
          explicit, pornographic, violent, or that targets someone based on
          race, ethnicity, national origin, religion, gender, gender identity,
          sexual orientation, disability, or serious disease.
        </li>
        <li>
          Post content that promotes drug sales, drink spiking, violence,
          self-harm, or any illegal activity.
        </li>
        <li>Impersonate another person, bar, or brand, or misrepresent your affiliation.</li>
        <li>Post spam, chain messages, or bulk commercial content.</li>
        <li>Use the Service to stalk, dox, or intimidate anyone.</li>
        <li>
          Scrape, reverse-engineer, copy, or resell any part of the Service or
          data we make available.
        </li>
        <li>
          Interfere with or disrupt the Service, probe its security, or use it
          to send malware.
        </li>
        <li>
          Submit false line reports, fake check-ins, or abuse the promotion
          or rewards system.
        </li>
      </ul>

      <h2>5. Reporting, blocking, and enforcement</h2>
      <p>
        Any post, comment, or user can be reported from inside the app. Any
        user can be blocked — once blocked, they can&rsquo;t see your content,
        friend you, or appear in your feed. We review reports regularly and
        commit to acting on reports of objectionable content within{" "}
        <strong>24 hours</strong>, which may include removing the content,
        warning the user, or terminating the account. We may remove content
        or suspend accounts that violate these Terms without prior notice.
      </p>

      <h2>6. Safety disclaimer — going out</h2>
      <ul>
        <li>
          Sip is not a ride-share, taxi, or transportation service. Never
          drive or operate machinery after drinking. If you need a ride, use
          a licensed service.
        </li>
        <li>
          Line times, capacity, crowd energy, and event details are submitted
          by users and venues and are <strong>estimates</strong>. Sip does not
          guarantee accuracy, that a bar is open, that a line is moving, or
          that a promotion will be honored at the door.
        </li>
        <li>
          Sip is not a seller of alcohol, a licensed retailer, or an
          establishment. Bars and their promotions are operated by the
          venues, not by Sip. Your interactions with those venues are between
          you and them.
        </li>
        <li>
          Drink responsibly. Respect bar staff, security, and the people
          around you.
        </li>
      </ul>

      <h2>7. Promotions and rewards</h2>
      <p>
        From time to time a bar may offer promotions through Sip. Each
        promotion is subject to the terms the bar sets (for example: dates,
        times, who qualifies, and how to redeem), and is offered by the bar,
        not by Sip. Sip provides the technology that shows you the offer and
        generates a short-lived QR code to verify redemption. Redemption is
        always at the venue&rsquo;s discretion.
      </p>

      <h2>8. Privacy</h2>
      <p>
        How we handle your information is explained in our{" "}
        <a href="/privacy">Privacy Policy</a>, which is incorporated into
        these Terms.
      </p>

      <h2>9. Location and permissions</h2>
      <p>
        Parts of Sip — the live map, line reports, crews, and events — depend
        on your location and other device permissions. You can grant or
        revoke those permissions at any time in iOS Settings. Sip still works
        with limited permissions, with fewer features.
      </p>

      <h2>10. Intellectual property</h2>
      <p>
        The Service, including its design, code, brand, and content
        (excluding Your Content and third-party content), is owned by Sip and
        protected by intellectual property laws. We grant you a limited,
        personal, non-transferable, non-exclusive license to use the Service
        in accordance with these Terms. We reserve all rights not expressly
        granted.
      </p>

      <h2>11. DMCA Notice</h2>
      <p>
        Sip respects the intellectual property rights of others and expects
        users of the platform to do the same.
      </p>
      <p>
        If you believe content available on Sip infringes your copyright,
        you may submit a notification under the Digital Millennium
        Copyright Act (DMCA) by providing our designated copyright agent
        with the following information:
      </p>
      <ul>
        <li>
          Identification of the copyrighted work claimed to have been
          infringed
        </li>
        <li>
          Identification of the infringing material and information
          reasonably sufficient to permit us to locate the material
        </li>
        <li>
          Your contact information, including name, address, telephone
          number, and email address
        </li>
        <li>
          A statement that you have a good faith belief that the disputed
          use is not authorized
        </li>
        <li>
          A statement, under penalty of perjury, that the information in
          the notification is accurate
        </li>
        <li>Your physical or electronic signature</li>
      </ul>
      <p>DMCA notices should be sent to:</p>
      <p>
        Sip Copyright Agent
        <br />
        Email:{" "}
        <a href="mailto:dmca@sipapp.co">dmca@sipapp.co</a>
      </p>
      <p>
        Sip may remove allegedly infringing content and terminate repeat
        infringers where appropriate. For the full takedown,
        counter-notification, and repeat-infringer procedures, see our{" "}
        <a href="/dmca">DMCA &amp; Copyright Policy</a>.
      </p>

      <h2>12. Third-party services</h2>
      <p>
        Sip runs on third-party infrastructure (Google/Firebase, Apple
        services, Google Sign-In) and may link out to bars, websites, or
        maps. We are not responsible for third-party services or content.
        Using them may be subject to their own terms and privacy policies.
      </p>

      <h2>13. Termination</h2>
      <p>
        You may delete your account at any time from inside the app, or by
        emailing <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>. We may
        suspend or terminate your access if you violate these Terms, if we
        are required to do so by law, or if we stop offering the Service.
        Sections of these Terms that by their nature should survive
        termination (ownership, disclaimers, limitation of liability, dispute
        resolution) will survive.
      </p>

      <h2>14. Disclaimers</h2>
      <p>
        To the fullest extent permitted by law, the Service is provided{" "}
        <strong>&ldquo;as is&rdquo;</strong> and{" "}
        <strong>&ldquo;as available,&rdquo;</strong> without warranties of
        any kind, whether express or implied, including merchantability,
        fitness for a particular purpose, non-infringement, and any warranty
        arising out of course of dealing or trade usage. Sip does not warrant
        that the Service will be uninterrupted, error-free, accurate, or
        secure, or that content submitted by users or venues is accurate.
      </p>

      <h2>15. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Sip and its officers,
        directors, employees, and agents will not be liable for any indirect,
        incidental, special, consequential, exemplary, or punitive damages,
        or any loss of profits, revenues, data, or goodwill, arising out of
        or related to your use of the Service. Our total liability for any
        claim arising out of or relating to these Terms or the Service will
        not exceed the greater of (a) one hundred U.S. dollars (US$100) or
        (b) the amount you have paid Sip in the twelve months before the
        claim.
      </p>

      <h2>16. Indemnity</h2>
      <p>
        You agree to indemnify and hold Sip harmless from claims, damages,
        and expenses (including reasonable attorneys&rsquo; fees) arising
        from Your Content, your use of the Service, or your violation of
        these Terms.
      </p>

      <h2>17. Dispute resolution and governing law</h2>
      <p>
        These Terms are governed by the laws of the State of New York,
        without regard to conflict-of-laws rules. Any dispute arising out of
        or relating to these Terms or the Service will be resolved
        exclusively in the state or federal courts located in New York County,
        New York, and you consent to personal jurisdiction there. Nothing in
        these Terms prevents either party from seeking injunctive relief in
        any court of competent jurisdiction.
      </p>

      <h2>18. Apple-specific terms (iOS)</h2>
      <p>
        If you obtained the Sip app through the Apple App Store, the
        following also applies. These Terms are between you and Sip only, not
        with Apple. Apple is not responsible for the Sip app or its content.
        Apple has no obligation to provide maintenance or support for the
        app. If the app fails to conform to any applicable warranty, you may
        notify Apple and Apple will refund the purchase price (if any);
        otherwise Apple has no warranty obligation. Apple is not responsible
        for addressing any product liability, intellectual-property, or
        consumer-protection claims relating to the app. Apple and its
        subsidiaries are third-party beneficiaries of these Terms and may
        enforce them against you. You represent that you are not located in a
        country subject to a U.S.-government embargo or designated by the
        U.S. government as a &ldquo;terrorist-supporting&rdquo; country, and
        that you are not on any U.S.-government list of prohibited or
        restricted parties.
      </p>

      <h2>19. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. When we make material
        changes we&rsquo;ll update the effective date above and, where
        appropriate, notify you inside the app. Your continued use of Sip
        after the effective date means you accept the updated Terms.
      </p>

      <h2>20. Contact</h2>
      <p>
        Sip, Inc. — questions, complaints, reports, legal notices:{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>.
      </p>
    </LegalPage>
  );
}
