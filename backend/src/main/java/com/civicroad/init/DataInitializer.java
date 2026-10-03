package com.civicroad.init;

import com.civicroad.entity.*;
import com.civicroad.repository.*;
import com.civicroad.service.PriorityEngineService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final AuthorityOfficerRepository officerRepository;
    private final DepartmentRepository departmentRepository;
    private final AreaRepository areaRepository;
    private final RoadRepository roadRepository;
    private final RoadIssueRepository roadIssueRepository;
    private final AIAnalysisRepository aiAnalysisRepository;
    private final IssueEvidenceRepository evidenceRepository;
    private final IssueStatusHistoryRepository statusHistoryRepository;
    private final RepairRecordRepository repairRecordRepository;
    private final CitizenFeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;
    private final PriorityEngineService priorityEngineService;

    public DataInitializer(
            UserRepository userRepository,
            CitizenProfileRepository citizenProfileRepository,
            AuthorityOfficerRepository officerRepository,
            DepartmentRepository departmentRepository,
            AreaRepository areaRepository,
            RoadRepository roadRepository,
            RoadIssueRepository roadIssueRepository,
            AIAnalysisRepository aiAnalysisRepository,
            IssueEvidenceRepository evidenceRepository,
            IssueStatusHistoryRepository statusHistoryRepository,
            RepairRecordRepository repairRecordRepository,
            CitizenFeedbackRepository feedbackRepository,
            PasswordEncoder passwordEncoder,
            PriorityEngineService priorityEngineService) {
        this.userRepository = userRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.officerRepository = officerRepository;
        this.departmentRepository = departmentRepository;
        this.areaRepository = areaRepository;
        this.roadRepository = roadRepository;
        this.roadIssueRepository = roadIssueRepository;
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.evidenceRepository = evidenceRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.repairRecordRepository = repairRecordRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
        this.priorityEngineService = priorityEngineService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already initialized with {} users. Skipping seed.", userRepository.count());
            return;
        }

        logger.info("[*] Seeding CivicRoad AI Demo Data...");

        // 1. Departments
        Department deptRoads = departmentRepository.save(new Department(
                "Roads & Highways Maintenance", "DEPT_ROADS", "roads@civicroad.ai", "Municipal road pavement and highway rehabilitation"));
        Department deptDrainage = departmentRepository.save(new Department(
                "Stormwater Drainage & Flood Works", "DEPT_DRAINAGE", "drainage@civicroad.ai", "Road drainage, culvert clearing, and flood prevention"));
        Department deptTraffic = departmentRepository.save(new Department(
                "Traffic Infrastructure & Signals", "DEPT_TRAFFIC", "traffic@civicroad.ai", "Road signs, median dividers, manholes, and traffic equipment"));

        // 2. Areas (Demo Zones)
        Area areaCentral = areaRepository.save(new Area("Demo Zone A - Central Corridor", "Hyderabad", "Telangana", 72));
        Area areaTech = areaRepository.save(new Area("Demo Zone B - Tech Corridor", "Hyderabad", "Telangana", 84));
        Area areaOldTown = areaRepository.save(new Area("Demo Zone C - Heritage Old City", "Hyderabad", "Telangana", 65));

        // 3. Roads
        Road roadMG = roadRepository.save(new Road("MG Road Central Corridor", areaCentral, "ARTERIAL", "HIGH", 68));
        Road roadCyber = roadRepository.save(new Road("Cyber Gateway Blvd", areaTech, "EXPRESSWAY", "CRITICAL", 82));
        Road roadUniv = roadRepository.save(new Road("University Campus Way", areaCentral, "COLLECTOR", "MEDIUM", 74));
        Road roadHeritage = roadRepository.save(new Road("Charminar Heritage Avenue", areaOldTown, "ARTERIAL", "HIGH", 59));
        Road roadFinDist = roadRepository.save(new Road("Financial District Radial 3", areaTech, "EXPRESSWAY", "CRITICAL", 88));
        Road roadLakeview = roadRepository.save(new Road("Lakeview Colony Road", areaCentral, "LOCAL", "LOW", 79));
        Road roadStation = roadRepository.save(new Road("Old Station Circular Road", areaOldTown, "ARTERIAL", "HIGH", 61));

        // 4. Users & Profiles
        // Admin
        User admin = userRepository.save(new User(
                "admin@civicroad.ai", passwordEncoder.encode("Admin@123"), "Executive Administrator", "9876543210", Role.ROLE_ADMIN));

        // Officers
        User officerRahulUser = userRepository.save(new User(
                "officer.rahul@civicroad.ai", passwordEncoder.encode("Officer@123"), "Rahul Sharma", "9876543211", Role.ROLE_OFFICER));
        AuthorityOfficer officerRahul = officerRepository.save(new AuthorityOfficer(officerRahulUser, deptRoads, "BADGE-101", areaCentral));
        officerRahul.setActiveCases(4);
        officerRahul.setCurrentWorkload(4);
        officerRepository.save(officerRahul);

        User officerPriyaUser = userRepository.save(new User(
                "officer.priya@civicroad.ai", passwordEncoder.encode("Officer@123"), "Priya Patel", "9876543212", Role.ROLE_OFFICER));
        AuthorityOfficer officerPriya = officerRepository.save(new AuthorityOfficer(officerPriyaUser, deptDrainage, "BADGE-102", areaTech));
        officerPriya.setActiveCases(3);
        officerPriya.setCurrentWorkload(3);
        officerRepository.save(officerPriya);

        // Citizens
        User citizenArun = userRepository.save(new User(
                "citizen.arun@civicroad.ai", passwordEncoder.encode("Citizen@123"), "Arun Kumar", "9876543220", Role.ROLE_CITIZEN));
        CitizenProfile profileArun = citizenProfileRepository.save(new CitizenProfile(citizenArun));
        profileArun.setPoints(145);
        profileArun.setReportsSubmitted(12);
        profileArun.setReportsVerified(10);
        profileArun.setReportsResolved(8);
        profileArun.setBadgeLevel("Road Safety Champion");
        citizenProfileRepository.save(profileArun);

        User citizenAnita = userRepository.save(new User(
                "citizen.anita@civicroad.ai", passwordEncoder.encode("Citizen@123"), "Anita Roy", "9876543221", Role.ROLE_CITIZEN));
        CitizenProfile profileAnita = citizenProfileRepository.save(new CitizenProfile(citizenAnita));
        profileAnita.setPoints(45);
        profileAnita.setReportsSubmitted(4);
        profileAnita.setReportsVerified(3);
        profileAnita.setReportsResolved(2);
        profileAnita.setBadgeLevel("Community Contributor");
        citizenProfileRepository.save(profileAnita);

        User citizenVikram = userRepository.save(new User(
                "citizen.vikram@civicroad.ai", passwordEncoder.encode("Citizen@123"), "Vikram Sethi", "9876543222", Role.ROLE_CITIZEN));
        CitizenProfile profileVikram = citizenProfileRepository.save(new CitizenProfile(citizenVikram));
        profileVikram.setPoints(15);
        profileVikram.setReportsSubmitted(1);
        profileVikram.setBadgeLevel("First Reporter");
        citizenProfileRepository.save(profileVikram);

        // 5. Seed Road Issues
        // Issue 1: High Priority Pothole on MG Road (Near Hospital) -> Critical 87/100
        createSeedIssue(
                "CR-2026-000001",
                citizenArun,
                roadMG,
                areaCentral,
                "POTHOLE",
                "CRITICAL",
                17.4065, 78.4772,
                "Near Gandhi General Hospital Gate 2, MG Road",
                "Gandhi General Hospital",
                "Deep crater-like pothole directly in the ambulance ingress lane. Poses severe vehicle overturning hazard.",
                "IN_PROGRESS",
                officerRahulUser,
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop",
                "Large road-surface depression occupying 35% of the visible ambulance lane with 12cm cavity depth.",
                93.4,
                0,
                null,
                false
        );

        // Issue 2: Duplicate Cluster Parent on Cyber Gateway Blvd (Community Evidence Fusion Demo)
        RoadIssue parentCluster = createSeedIssue(
                "CR-2026-000002",
                citizenArun,
                roadCyber,
                areaTech,
                "POTHOLE",
                "HIGH",
                17.4485, 78.3750,
                "Cyber Gateway Blvd Junction near Mindspace Metro",
                "Mindspace Metro Station",
                "Large pothole cluster near traffic signal junction slowing morning commute.",
                "ASSIGNED",
                officerPriyaUser,
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop",
                "Multiple localized asphalt cavities with severe edge crumbling near signal stop line.",
                91.8,
                3,
                null,
                false
        );

        // Children of parent cluster (Duplicates)
        createSeedIssue(
                "CR-2026-000003",
                citizenAnita,
                roadCyber,
                areaTech,
                "POTHOLE",
                "HIGH",
                17.4487, 78.3752,
                "Intersection near Cyber Gateway Metro",
                "Metro Station",
                "Severe pothole causing heavy traffic gridlock during peak hours.",
                "MERGED",
                officerPriyaUser,
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
                "Confirmed duplicate pothole damage within 25 meters.",
                89.2,
                0,
                parentCluster,
                false
        );

        createSeedIssue(
                "CR-2026-000004",
                citizenVikram,
                roadCyber,
                areaTech,
                "POTHOLE",
                "HIGH",
                17.4483, 78.3748,
                "Cyber Gateway Road hole near signal",
                "Signal junction",
                "Deep hole in left turn lane near signal.",
                "MERGED",
                officerPriyaUser,
                "https://images.unsplash.com/photo-1584463699042-3788a444a769?w=800&auto=format&fit=crop",
                "Duplicate community observation of Cyber Gateway pothole.",
                90.1,
                0,
                parentCluster,
                false
        );

        // Issue 3: Open Infrastructure / Missing Drain Cover (Critical SLA Breach demo)
        RoadIssue escalatedIssue = createSeedIssue(
                "CR-2026-000005",
                citizenAnita,
                roadHeritage,
                areaOldTown,
                "OPEN_INFRASTRUCTURE",
                "CRITICAL",
                17.3616, 78.4747,
                "Charminar South Promenade, near High School",
                "Govt Girls High School",
                "Missing storm drain grate on busy pedestrian street. Major hazard for schoolchildren.",
                "ESCALATED",
                officerRahulUser,
                "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop",
                "Severe open utility void without safety barricade in pedestrian right-of-way.",
                96.2,
                1,
                null,
                true
        );

        // Issue 4: Before & After Repair Completed -> Awaiting Citizen Confirmation
        RoadIssue repairCompletedIssue = createSeedIssue(
                "CR-2026-000006",
                citizenArun,
                roadUniv,
                areaCentral,
                "SURFACE_DETERIORATION",
                "MEDIUM",
                17.4125, 78.4982,
                "University Way near Library Circle",
                "Central Library",
                "Extensive asphalt stripping and raveling causing loose gravel scatter.",
                "AWAITING_CITIZEN_CONFIRMATION",
                officerRahulUser,
                "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop",
                "Asphalt aggregate detachment across 18 meters of roadway surface.",
                88.5,
                0,
                null,
                false
        );

        // Add repair record for Issue 4 with Before/After images
        IssueEvidence beforeEvidence = evidenceRepository.findByIssueOrderByCreatedAtAsc(repairCompletedIssue).get(0);
        IssueEvidence afterEvidence = evidenceRepository.save(new IssueEvidence(
                repairCompletedIssue,
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
                "IMAGE",
                true,
                officerRahulUser
        ));
        RepairRecord repair4 = new RepairRecord();
        repair4.setIssue(repairCompletedIssue);
        repair4.setOfficer(officerRahulUser);
        repair4.setRepairDate(LocalDateTime.now().minusHours(4));
        repair4.setMaterialsUsed("Dense Bituminous Macadam (DBM) hot-mix asphalt + tack coat");
        repair4.setCostEstimate(24500.0);
        repair4.setInspectionNotes("Milled deteriorating topcoat, leveled base with aggregate, applied 50mm compacted asphalt seal.");
        repair4.setBeforeEvidence(beforeEvidence);
        repair4.setAfterEvidence(afterEvidence);
        repairRecordRepository.save(repair4);

        // Issue 5: Fully Resolved Issue with Citizen Feedback
        RoadIssue resolvedIssue = createSeedIssue(
                "CR-2026-000007",
                citizenAnita,
                roadFinDist,
                areaTech,
                "ALLIGATOR_CRACKING",
                "MEDIUM",
                17.4285, 78.3410,
                "Financial District Radial 3 near Wipro Circle",
                "Wipro Circle",
                "Spider-web alligator cracking spanning 10 meters of right lane.",
                "RESOLVED",
                officerPriyaUser,
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
                "Interconnected fatigue cracking pattern indicative of sub-base deflection.",
                92.1,
                0,
                null,
                false
        );

        IssueEvidence before5 = evidenceRepository.findByIssueOrderByCreatedAtAsc(resolvedIssue).get(0);
        IssueEvidence after5 = evidenceRepository.save(new IssueEvidence(
                resolvedIssue,
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop",
                "IMAGE",
                true,
                officerPriyaUser
        ));
        RepairRecord repair5 = new RepairRecord();
        repair5.setIssue(resolvedIssue);
        repair5.setOfficer(officerPriyaUser);
        repair5.setRepairDate(LocalDateTime.now().minusDays(2));
        repair5.setMaterialsUsed("Cold-pour polymer crack sealant and bituminous resurfacing");
        repair5.setCostEstimate(18000.0);
        repair5.setInspectionNotes("Full crack cleanout, thermal routing, sealant application, and smooth seal finish.");
        repair5.setBeforeEvidence(before5);
        repair5.setAfterEvidence(after5);
        repairRecordRepository.save(repair5);

        // Citizen satisfaction feedback
        feedbackRepository.save(new CitizenFeedback(
                resolvedIssue,
                citizenAnita,
                "FIXED",
                5,
                "Smooth ride restored! Excellent repair work by municipal team."
        ));

        // Additional issues across categories for rich heatmap and analytics
        createSeedIssue("CR-2026-000008", citizenArun, roadStation, areaOldTown, "WATER_DAMAGE", "HIGH",
                17.3755, 78.4812, "Station Road Underpass", "Railway Station",
                "Severe standing water causing asphalt erosion and pothole clusters.", "UNDER_REVIEW", null,
                "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop",
                "Ponding water stripping bitumen from road surface.", 89.5, 0, null, false);

        createSeedIssue("CR-2026-000009", citizenAnita, roadLakeview, areaCentral, "EDGE_DAMAGE", "LOW",
                17.4201, 78.4610, "Lakeview Colony 5th Main", "Community Park",
                "Shoulder curb broken off and edge pavement crumbling.", "REPORTED", null,
                "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop",
                "Superficial shoulder erosion along residential kerb.", 84.1, 0, null, false);

        createSeedIssue("CR-2026-000010", citizenVikram, roadCyber, areaTech, "ROAD_DEPRESSION", "HIGH",
                17.4420, 78.3812, "Cyber Towers Radial Lane 2", "Cyber Towers",
                "Significant road subsidence depression causing cars to scrape undercarriage.", "IN_PROGRESS", officerPriyaUser,
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop",
                "Wheel path rutting and structural depression of approximately 9cm.", 91.0, 0, null, false);

        logger.info("[✓] CivicRoad AI Demo Data Seeded successfully!");
    }

    private RoadIssue createSeedIssue(
            String refCode,
            User citizen,
            Road road,
            Area area,
            String damageType,
            String severity,
            double lat, double lon,
            String address,
            String landmark,
            String description,
            String status,
            User officer,
            String imageUrl,
            String aiExplanation,
            double aiConfidence,
            int dupCount,
            RoadIssue parent,
            boolean isEscalated) {

        RoadIssue issue = new RoadIssue();
        issue.setReferenceCode(refCode);
        issue.setCitizen(citizen);
        issue.setRoad(road);
        issue.setArea(area);
        issue.setDamageType(damageType);
        issue.setSeverity(severity);
        issue.setLatitude(lat);
        issue.setLongitude(lon);
        issue.setAddress(address);
        issue.setLandmark(landmark);
        issue.setDescription(description);
        issue.setStatus(status);
        issue.setAssignedOfficer(officer);
        issue.setParentIssue(parent);
        issue.setDuplicateCount(dupCount);
        issue.setIsEscalated(isEscalated);

        // Priority calculation
        PriorityEngineService.PriorityResult prio = priorityEngineService.calculatePriority(
                damageType, severity, road, landmark, dupCount,
                isEscalated ? LocalDateTime.now().minusHours(48) : LocalDateTime.now().minusHours(6),
                status
        );
        issue.setPriorityScore(prio.getScore());
        issue.setPriorityBreakdown(prio.getBreakdownJson());
        issue.setSlaDueDate(prio.getSlaDueDate());

        issue = roadIssueRepository.save(issue);

        // AI analysis
        AIAnalysis ai = new AIAnalysis();
        ai.setIssue(issue);
        ai.setPredictedDamageType(damageType);
        ai.setPredictedSeverity(severity);
        ai.setConfidencePercentage(aiConfidence);
        ai.setExplanation(aiExplanation);
        ai.setModelSource("COMPUTER_VISION_SERVICE");
        aiAnalysisRepository.save(ai);

        // Evidence
        if (imageUrl != null) {
            IssueEvidence evidence = new IssueEvidence(issue, imageUrl, imageUrl, "IMAGE", false, citizen);
            evidenceRepository.save(evidence);
        }

        // Status history
        statusHistoryRepository.save(new IssueStatusHistory(
                issue, citizen != null ? citizen : officer, null, status, "Initial demo issue setup."
        ));

        return issue;
    }
}
