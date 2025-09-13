import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Users,
  Calendar,
  DollarSign,
  Swords
} from 'lucide-react-native';

interface TournamentListItemProps {
  tournament: {
    id: string;
    title: string;
    participants: number;
    maxParticipants: number;
    date: string;
    rank: string;
    prizePool: number;
    ballType: number;
    status: 'ready' | 'live' | 'done';
  };
  onPress: () => void;
  onJoin: () => void;
}

export const TournamentListItem: React.FC<TournamentListItemProps> = ({
  tournament,
  onPress,
  onJoin
}) => {
  const getBallColor = (ballNumber: number) => {
    switch (ballNumber) {
      case 8: return '#000000';
      case 9: return '#FFD700';
      case 10: return '#0066CC';
      default: return '#000000';
    }
  };

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000000).toFixed(0)} Million`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return '#0A5C6D';
      case 'live': return '#10B981';
      case 'done': return '#666';
      default: return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Chơi luôn';
      case 'live': return 'Đang live';
      case 'done': return 'Đã kết thúc';
      default: return status;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.tournamentHeader}>
        <View style={styles.ballIconContainer}>
          <View style={[styles.ballIcon, { backgroundColor: getBallColor(tournament.ballType) }]}>
            <Text style={styles.ballNumber}>{tournament.ballType}</Text>
          </View>
        </View>
        
        <View style={styles.tournamentInfo}>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          <View style={styles.tournamentMeta}>
            <Text style={styles.rankText}>K - I+</Text>
            <Text style={styles.networkText}>2 Mạng</Text>
          </View>
          <View style={styles.tournamentDetails}>
            <View style={styles.detailItem}>
              <Calendar size={14} color="#666" />
              <Text style={styles.detailText}>{tournament.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={14} color="#FF004F" />
              <Text style={styles.detailText}>{tournament.participants}/{tournament.maxParticipants}</Text>
            </View>
            <View style={styles.detailItem}>
              <DollarSign size={14} color="#666" />
              <Text style={styles.detailText}>{formatCurrency(tournament.prizePool)}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: getStatusColor(tournament.status) }]}
          onPress={onJoin}
        >
          <Swords size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ballIconContainer: {
    marginRight: 12,
  },
  ballIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  ballNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A5C6D',
    marginBottom: 4,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  rankText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  networkText: {
    fontSize: 12,
    color: '#0A5C6D',
    fontWeight: '600',
  },
  tournamentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});