import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Platform, 
  RefreshControl,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MessageSquare, 
  Clock, 
  Copy, 
  Trash2, 
  Image as ImageIcon,
  Sparkles,
  CircleCheck as CheckCircle2
} from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface HistoryItem {
  id: string;
  title: string;
  originalText: string;
  reply: string;
  date: Date;
  type: 'paste' | 'screenshot';
  imageUri?: string;
}

// Mock data for UI demonstration
const mockHistory: HistoryItem[] = [
  {
    id: '1',
    title: 'Chat with Sarah',
    originalText: 'Hey! How was your day? I was thinking about you 😊',
    reply: 'Yeh toh full rizz mode on hai 😎',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    type: 'paste'
  },
  {
    id: '2',
    title: 'Screenshot from Dating App',
    originalText: 'Your photos are amazing! Would love to take you out for coffee ☕',
    reply: 'Smooth operator detected! 🔥',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    type: 'screenshot',
    imageUri: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Chat with Alex',
    originalText: 'That movie was incredible! We should definitely watch the sequel together',
    reply: 'Kya baat hai, charm level 💯',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    type: 'paste'
  }
];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'paste' | 'screenshot'>('all');

  const selectionScale = useSharedValue(0);

  const handleCopyReply = (reply: string, itemId: string) => {
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSelection = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
    
    if (newSelection.size === 0) {
      setIsSelectionMode(false);
      selectionScale.value = withTiming(0);
    }
  };

  const startSelectionMode = (itemId: string) => {
    setIsSelectionMode(true);
    setSelectedItems(new Set([itemId]));
    selectionScale.value = withTiming(1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const selectionAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: selectionScale.value }],
      opacity: selectionScale.value,
    };
  });

  const renderItem = ({ item, index }: { item: HistoryItem, index: number }) => {
    const isSelected = selectedItems.has(item.id);
    const isCopied = copiedId === item.id;
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100)}
        style={[
          styles.historyItem,
          isSelected && styles.selectedItem
        ]}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => {
            if (isSelectionMode) {
              toggleSelection(item.id);
            }
          }}
          onLongPress={() => {
            if (!isSelectionMode) {
              startSelectionMode(item.id);
            }
          }}
        >
          <View style={styles.itemHeader}>
            <View style={styles.iconContainer}>
              {item.type === 'paste' ? (
                <MessageSquare size={20} color={Colors.primary.main} />
              ) : (
                <ImageIcon size={20} color={Colors.secondary.main} />
              )}
            </View>
            
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemPreview} numberOfLines={2}>
                {item.originalText}
              </Text>
            </View>
            
            <View style={styles.itemMeta}>
              <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
              <Text style={styles.itemTime}>{formatTime(item.date)}</Text>
            </View>
          </View>
          
          <View style={styles.replySection}>
            <View style={styles.replyHeader}>
              <Sparkles size={14} color={Colors.primary.main} />
              <Text style={styles.replyLabel}>Witty Reply:</Text>
            </View>
            <Text style={styles.replyText} numberOfLines={2}>
              {item.reply}
            </Text>
          </View>
          
          <View style={styles.itemActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCopyReply(item.reply, item.id)}
            >
              {isCopied ? (
                <CheckCircle2 size={16} color={Colors.success.main} />
              ) : (
                <Copy size={16} color={Colors.neutral.darker} />
              )}
              <Text style={[
                styles.actionButtonText,
                isCopied && { color: Colors.success.main }
              ]}>
                {isCopied ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                const updatedHistory = history.filter(h => h.id !== item.id);
                setHistory(updatedHistory);
              }}
            >
              <Trash2 size={16} color={Colors.error.main} />
              <Text style={[styles.actionButtonText, { color: Colors.error.main }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <CheckCircle2 size={20} color={Colors.primary.main} />
          </View>
        )}
      </Animated.View>
    );
  };

  const EmptyState = () => (
    <Animated.View 
      entering={FadeIn.delay(300)}
      style={styles.emptyContainer}
    >
      <Clock size={64} color={Colors.neutral.dark} />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptyText}>
        Your chat analysis history will appear here.{'\n'}
        Start by pasting a chat or uploading a screenshot!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.emptyButtonText}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const FilterButton = ({ type, label }: { type: typeof filter, label: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.activeFilterButton
      ]}
      onPress={() => setFilter(type)}
    >
      <Text style={[
        styles.filterButtonText,
        filter === type && styles.activeFilterButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8F9FA']}
        style={styles.gradient}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your History</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} conversation{history.length !== 1 ? 's' : ''} saved
        </Text>
        
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <FilterButton type="all" label="All" />
          <FilterButton type="paste" label="Paste" />
          <FilterButton type="screenshot" label="Screenshot" />
        </View>
      </View>
      
      {/* Selection Mode Header */}
      {isSelectionMode && (
        <Animated.View 
          style={[styles.selectionHeader, selectionAnimatedStyle]}
        >
          <Text style={styles.selectionText}>
            {selectedItems.size} selected
          </Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.selectionAction}
              onPress={() => {
                const updatedHistory = history.filter(item => !selectedItems.has(item.id));
                setHistory(updatedHistory);
                setSelectedItems(new Set());
                setIsSelectionMode(false);
                selectionScale.value = withTiming(0);
              }}
            >
              <Trash2 size={20} color={Colors.error.main} />
              <Text style={styles.selectionActionText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.selectionAction}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedItems(new Set());
                selectionScale.value = withTiming(0);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
      
      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary.main}
            colors={[Colors.primary.main]}
          />
        }
      />
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
    bottom: 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.light,
  },
  headerTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 28,
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.neutral.light,
    borderWidth: 1,
    borderColor: Colors.neutral.medium,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  filterButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.neutral.darker,
  },
  activeFilterButtonText: {
    color: Colors.neutral.white,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary.main,
  },
  selectionText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.white,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  selectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectionActionText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.error.main,
  },
  cancelText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.neutral.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  historyItem: {
    backgroundColor: Colors.neutral.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: Colors.primary.main,
  },
  itemContent: {
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.black,
    marginBottom: 4,
  },
  itemPreview: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: Colors.neutral.darker,
    lineHeight: 20,
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemDate: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: Colors.neutral.dark,
    marginBottom: 2,
  },
  itemTime: {
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
    color: Colors.neutral.dark,
  },
  replySection: {
    backgroundColor: Colors.accent.light,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  replyLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: Colors.primary.main,
    marginLeft: 4,
  },
  replyText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: Colors.neutral.black,
    lineHeight: 20,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.light,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.neutral.light,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: Colors.neutral.darker,
    marginLeft: 4,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.neutral.white,
    borderRadius: 12,
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 24,
    color: Colors.neutral.black,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: Colors.neutral.darker,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: Colors.neutral.white,
  },
});