import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Zap, Clock, Heart, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import PremiumBadge from '@/components/PremiumBadge';

export default function PremiumScreen() {
  const handlePurchase = (plan: string) => {
    console.log(`Selected plan: ${plan}`);
    // UI only - no actual purchase logic
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8675C7', '#A18CD1']}
        style={styles.gradient}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <PremiumBadge size="large" />
          <Text style={styles.headerTitle}>Upgrade to Premium</Text>
          <Text style={styles.headerSubtitle}>
            Unlock all features and remove ads
          </Text>
        </View>
        
        <View style={styles.benefitsContainer}>
          <BenefitItem
            icon={<Shield size={22} color={Colors.primary.main} />}
            title="Ad-Free Experience"
            description="Enjoy Flirtshaala without any advertisements"
          />
          
          <BenefitItem
            icon={<Zap size={22} color={Colors.primary.main} />}
            title="Unlimited Flirty Responses"
            description="No daily limits on AI-generated flirty messages"
          />
          
          <BenefitItem
            icon={<Clock size={22} color={Colors.primary.main} />}
            title="Priority Processing"
            description="Get faster responses even during peak hours"
          />
          
          <BenefitItem
            icon={<Heart size={22} color={Colors.primary.main} fill={Colors.primary.main} />}
            title="Exclusive Flirting Templates"
            description="Access to premium templates for different situations"
          />
        </View>
        
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Choose Your Plan</Text>
          
          <View style={styles.planCard}>
            <View style={styles.planHeaderRow}>
              <Text style={styles.planTitle}>Monthly</Text>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planCurrency}>₹</Text>
                <Text style={styles.planPrice}>199</Text>
                <Text style={styles.planPeriod}>/month</Text>
              </View>
            </View>
            
            <View style={styles.planFeatures}>
              <PlanFeature text="All Premium Features" />
              <PlanFeature text="Monthly Billing" />
              <PlanFeature text="Cancel Anytime" />
            </View>
            
            <Button
              title="Choose Monthly"
              variant="secondary"
              onPress={() => handlePurchase('monthly')}
              fullWidth
            />
          </View>
          
          <View style={[styles.planCard, styles.featuredPlan]}>
            <View style={styles.bestValueTag}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
            
            <View style={styles.planHeaderRow}>
              <Text style={[styles.planTitle, styles.featuredPlanTitle]}>Annual</Text>
              <View style={styles.planPriceContainer}>
                <Text style={[styles.planCurrency, styles.featuredPlanText]}>₹</Text>
                <Text style={[styles.planPrice, styles.featuredPlanText]}>999</Text>
                <Text style={[styles.planPeriod, styles.featuredPlanText]}>/year</Text>
              </View>
            </View>
            
            <View style={styles.savingsContainer}>
              <Text style={styles.savingsText}>Save ₹1,389 (58%)</Text>
            </View>
            
            <View style={styles.planFeatures}>
              <PlanFeature text="All Premium Features" featured />
              <PlanFeature text="Annual Billing" featured />
              <PlanFeature text="Priority Support" featured />
              <PlanFeature text="Early Access to New Features" featured />
            </View>
            
            <Button
              title="Choose Annual"
              onPress={() => handlePurchase('annual')}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIconContainer}>
        {icon}
      </View>
      <View style={styles.benefitContent}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{description}</Text>
      </View>
    </View>
  );
}

function PlanFeature({ text, featured = false }: { text: string, featured?: boolean }) {
  return (
    <View style={styles.planFeatureRow}>
      <Check size={16} color={featured ? Colors.primary.main : Colors.secondary.main} />
      <Text style={[
        styles.planFeatureText,
        featured && styles.featuredPlanFeatureText
      ]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.white,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.neutral.white,
    marginTop: 16,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.white,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  benefitsContainer: {
    backgroundColor: Colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 24,
    padding: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 16,
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    lineHeight: 20,
  },
  plansContainer: {
    paddingHorizontal: 24,
  },
  plansTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
    color: Colors.neutral.black,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featuredPlan: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
    position: 'relative',
    paddingTop: 30,
  },
  bestValueTag: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  bestValueText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: Colors.neutral.white,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: Colors.neutral.black,
  },
  featuredPlanTitle: {
    color: Colors.primary.main,
  },
  featuredPlanText: {
    color: Colors.primary.main,
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  planCurrency: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.black,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  planPrice: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.neutral.black,
  },
  planPeriod: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginBottom: 4,
    marginLeft: 2,
  },
  savingsContainer: {
    backgroundColor: Colors.accent.light,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  savingsText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: Colors.primary.main,
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  planFeatureText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginLeft: 8,
  },
  featuredPlanFeatureText: {
    color: Colors.neutral.black,
  },
});